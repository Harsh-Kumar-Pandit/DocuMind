import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { chatService } from "../services/chatService";
import {
  isDocumentReady,
  isDocumentProcessing,
  isDocumentFailed,
  normalizeStatus,
} from "../../../lib/documentStatus";

export default function useChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/app/chat");

  // Document states
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [documentError, setDocumentError] = useState("");

  // Processing & readiness
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState("");
  const [ready, setReady] = useState(false);

  // Conversation states
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversationError, setConversationError] = useState("");

  // Message states
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Refs for tracking & race-condition elimination
  const selectedDocumentRef = useRef(null);
  const activeConversationRef = useRef(null);
  const activeDocRequestIdRef = useRef(0);
  const activeMsgRequestIdRef = useRef(0);
  const creatingConversationPromiseRef = useRef({});

  // In-memory caches to make document switching instantaneous (Bug 2 fix)
  const conversationsCacheRef = useRef({}); // { [docId]: Conversation[] }
  const messagesCacheRef = useRef({}); // { [convId]: Message[] }
  const lastActiveConvRef = useRef({}); // { [docId]: convId }

  // Sync refs safely in effects
  useEffect(() => {
    selectedDocumentRef.current = selectedDocument;
  }, [selectedDocument]);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // 1. Fetch document list
  const loadDocuments = useCallback(async () => {
    setDocumentLoading(true);
    setDocumentError("");
    try {
      const data = await chatService.listDocuments();
      const docList = data.documents || [];
      setDocuments(docList);
      return docList;
    } catch (error) {
      setDocumentError(error.message || "Could not load documents.");
      return [];
    } finally {
      setDocumentLoading(false);
    }
  }, []);

  // 2. Open an existing conversation and load its messages
  const openConversation = useCallback(
    async (conversation, docId) => {
      if (!conversation) return;
      const targetDocId =
        docId || conversation.documentId || selectedDocumentRef.current?.id;

      // Verify conversation belongs to expected document
      if (
        conversation.documentId &&
        targetDocId &&
        conversation.documentId !== targetDocId
      ) {
        return;
      }

      activeConversationRef.current = conversation;
      setActiveConversation(conversation);
      if (targetDocId) {
        lastActiveConvRef.current[targetDocId] = conversation.id;
      }
      setConversationError("");

      // Update URL search params cleanly without losing document
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (targetDocId) next.set("document", targetDocId);
          next.set("conversation", conversation.id);
          return next;
        },
        { replace: true },
      );

      // Check cache for instant messages render (0ms switching latency)
      const cached = messagesCacheRef.current[conversation.id];
      if (cached) {
        setMessages(cached);
        setMessagesLoading(false);
        return;
      }

      // Not cached: clear messages and fetch
      setMessages([]);
      setMessagesLoading(true);

      const reqId = ++activeMsgRequestIdRef.current;
      try {
        const data = await chatService.getMessages(
          conversation.id,
          targetDocId,
        );
        // Verify response is still for the current conversation and request
        if (
          reqId === activeMsgRequestIdRef.current &&
          activeConversationRef.current?.id === conversation.id
        ) {
          const loaded = data.messages || [];
          messagesCacheRef.current[conversation.id] = loaded;
          setMessages(loaded);
        }
      } catch (error) {
        if (
          reqId === activeMsgRequestIdRef.current &&
          activeConversationRef.current?.id === conversation.id
        ) {
          setConversationError(
            error.message || "Could not load conversation messages.",
          );
          setMessages([]);
        }
      } finally {
        if (reqId === activeMsgRequestIdRef.current) {
          setMessagesLoading(false);
        }
      }
    },
    [setSearchParams],
  );

  // 3. Create a real conversation on backend for a specific document
  const createConversation = useCallback(
    async (documentId) => {
      if (!documentId) return null;
      if (creatingConversationPromiseRef.current[documentId]) {
        return creatingConversationPromiseRef.current[documentId];
      }
      setConversationError("");

      const promise = (async () => {
        try {
          const data = await chatService.createConversation(documentId);
          const newConv = data.conversation;

          const currentList = conversationsCacheRef.current[documentId] || [];
          const nextList = [
            newConv,
            ...currentList.filter((c) => c.id !== newConv.id),
          ];
          conversationsCacheRef.current[documentId] = nextList;

          if (selectedDocumentRef.current?.id === documentId) {
            setConversations(nextList);
            activeConversationRef.current = newConv;
            setActiveConversation(newConv);
            lastActiveConvRef.current[documentId] = newConv.id;
            messagesCacheRef.current[newConv.id] = [];
            setMessages([]);
            setMessagesLoading(false);

            setSearchParams(
              (prev) => {
                const next = new URLSearchParams(prev);
                next.set("document", documentId);
                next.set("conversation", newConv.id);
                return next;
              },
              { replace: true },
            );
          }

          return newConv;
        } catch (error) {
          setConversationError(error.message || "Could not create conversation.");
          return null;
        } finally {
          delete creatingConversationPromiseRef.current[documentId];
          if (selectedDocumentRef.current?.id === documentId) {
            setMessagesLoading(false);
            setConversationsLoading(false);
          }
        }
      })();

      creatingConversationPromiseRef.current[documentId] = promise;
      return promise;
    },
    [setSearchParams],
  );

  // 4. Load conversations for the selected document (with cache & concurrency checks)
  const loadConversations = useCallback(
    async (documentId, targetConversationId = null) => {
      if (!documentId) return;
      const reqId = ++activeDocRequestIdRef.current;
      setConversationError("");

      try {
        const data = await chatService.listConversations(documentId);
        if (
          reqId !== activeDocRequestIdRef.current ||
          selectedDocumentRef.current?.id !== documentId
        ) {
          return;
        }

        const list = data.conversations || [];
        conversationsCacheRef.current[documentId] = list;
        setConversations(list);

        if (list.length > 0) {
          // Priority: targetConversationId -> lastActive -> first in list
          const preferredId =
            targetConversationId || lastActiveConvRef.current[documentId];
          const matched = preferredId
            ? list.find((c) => c.id === preferredId)
            : null;
          const toOpen = matched || list[0];
          await openConversation(toOpen, documentId);
        } else {
          // No conversations yet for this document: create the initial one
          activeConversationRef.current = null;
          setActiveConversation(null);
          setMessages([]);
          await createConversation(documentId);
        }
      } catch (error) {
        if (
          reqId === activeDocRequestIdRef.current &&
          selectedDocumentRef.current?.id === documentId
        ) {
          setConversationError(
            error.message || "Could not load conversations.",
          );
          setConversations([]);
          activeConversationRef.current = null;
          setActiveConversation(null);
          setMessages([]);
        }
      } finally {
        if (
          reqId === activeDocRequestIdRef.current &&
          selectedDocumentRef.current?.id === documentId
        ) {
          setConversationsLoading(false);
          setMessagesLoading(false);
        }
      }
    },
    [createConversation, openConversation],
  );

  // 5. Deliberate preparation (for unready or failed documents that user asks to prepare/retry)
  const retryPreparation = useCallback(
    async (doc) => {
      const targetDoc = doc || selectedDocumentRef.current;
      if (!targetDoc) return;

      setProcessing(true);
      setProcessingError("");
      setReady(false);

      try {
        let current = targetDoc;
        if (normalizeStatus(current.status) !== "COMPLETED") {
          await chatService.extractDocument(current.id);
          current = { ...current, status: "COMPLETED" };
        }
        await chatService.embedDocument(current.id);

        current = { ...current, status: "COMPLETED" };
        selectedDocumentRef.current = current;
        setSelectedDocument(current);
        setDocuments((docs) =>
          docs.map((d) => (d.id === current.id ? current : d)),
        );
        setReady(true);
        await loadConversations(current.id);
      } catch (err) {
        setProcessingError(err.message || "Document preparation failed.");
      } finally {
        setProcessing(false);
      }
    },
    [loadConversations],
  );

  // 6. Handle document selection logic with INSTANT message isolation & zero stale leaks
  const selectDocument = useCallback(
    (doc, targetConversationId = null) => {
      if (!doc) {
        selectedDocumentRef.current = null;
        activeConversationRef.current = null;
        setSelectedDocument(null);
        setActiveConversation(null);
        setConversations([]);
        setMessages([]);
        setReady(false);
        setProcessing(false);
        setProcessingError("");
        return;
      }

      // If it's already the selected document:
      if (doc.id === selectedDocumentRef.current?.id) {
        if (
          targetConversationId &&
          activeConversationRef.current?.id !== targetConversationId
        ) {
          const cached = conversationsCacheRef.current[doc.id];
          const matched = cached?.find((c) => c.id === targetConversationId);
          if (matched) {
            openConversation(matched, doc.id);
          }
        }
        return;
      }

      // Immediately set selected document
      selectedDocumentRef.current = doc;
      setSelectedDocument(doc);

      // Invalidate current inflight request tokens to ignore pending responses from previous document
      activeDocRequestIdRef.current++;
      activeMsgRequestIdRef.current++;

      // Check cache for instant switching
      const cachedConvs = conversationsCacheRef.current[doc.id];
      const lastActiveId =
        targetConversationId || lastActiveConvRef.current[doc.id];

      if (cachedConvs && cachedConvs.length > 0) {
        // Instant cache restore (Bug 2 fix: 0ms switching latency)
        setConversations(cachedConvs);
        setConversationsLoading(false);

        const activeConv =
          (lastActiveId && cachedConvs.find((c) => c.id === lastActiveId)) ||
          cachedConvs[0];

        activeConversationRef.current = activeConv;
        setActiveConversation(activeConv);

        const cachedMessages = messagesCacheRef.current[activeConv.id];
        if (cachedMessages) {
          setMessages(cachedMessages);
          setMessagesLoading(false);
        } else {
          setMessages([]);
          setMessagesLoading(true);
          // Fetch messages for this cached conversation
          chatService
            .getMessages(activeConv.id, doc.id)
            .then((data) => {
              if (activeConversationRef.current?.id === activeConv.id) {
                const loaded = data.messages || [];
                messagesCacheRef.current[activeConv.id] = loaded;
                setMessages(loaded);
                setMessagesLoading(false);
              }
            })
            .catch(() => {
              if (activeConversationRef.current?.id === activeConv.id) {
                setMessagesLoading(false);
              }
            });
        }
      } else {
        // Bug 1 fix: IMMEDIATELY isolate & clear previous document's messages and conversation
        // Never allow previous document's messages or active conversation to remain visible
        activeConversationRef.current = null;
        setActiveConversation(null);
        setConversations([]);
        setMessages([]);
        setConversationsLoading(true);
        setMessagesLoading(true);
      }

      // Update URL without triggering full page reload
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("document", doc.id);
          if (targetConversationId) {
            next.set("conversation", targetConversationId);
          } else {
            next.delete("conversation");
          }
          return next;
        },
        { replace: true },
      );

      // Check status
      if (isDocumentReady(doc)) {
        setReady(true);
        setProcessing(false);
        setProcessingError("");
        loadConversations(doc.id, targetConversationId);
      } else if (isDocumentProcessing(doc)) {
        setReady(false);
        setProcessing(true);
        setProcessingError("");
        setConversations([]);
        activeConversationRef.current = null;
        setActiveConversation(null);
        setMessages([]);
        setConversationsLoading(false);
        setMessagesLoading(false);
      } else if (isDocumentFailed(doc)) {
        setReady(false);
        setProcessing(false);
        setProcessingError(
          doc.errorMessage || "Document processing previously failed.",
        );
        setConversations([]);
        activeConversationRef.current = null;
        setActiveConversation(null);
        setMessages([]);
        setConversationsLoading(false);
        setMessagesLoading(false);
      } else {
        // UPLOADED
        setReady(false);
        setProcessing(false);
        setProcessingError("");
        setConversations([]);
        activeConversationRef.current = null;
        setActiveConversation(null);
        setMessages([]);
        setConversationsLoading(false);
        setMessagesLoading(false);
      }
    },
    [loadConversations, openConversation, setSearchParams],
  );

  // 7. Synchronize documents and route state
  useEffect(() => {
    let ignore = false;

    async function sync() {
      const urlDocId = searchParams.get("document");
      const urlConvId = searchParams.get("conversation");

      const hasUrlDocInState = urlDocId
        ? documents.some((d) => d.id === urlDocId)
        : false;

      let currentDocs = documents;

      // Determine if documents need to be fetched from backend:
      // 1. If we have not loaded documents yet (currentDocs.length === 0)
      // 2. Or if urlDocId was specified in URL but is NOT in current documents list
      // 3. Or if we are on /app/chat and have no selected document
      const needsFetch =
        currentDocs.length === 0 ||
        (urlDocId && !hasUrlDocInState) ||
        (isChatRoute && !selectedDocumentRef.current);

      if (needsFetch) {
        setDocumentLoading(true);
        setDocumentError("");
        try {
          const data = await chatService.listDocuments();
          if (ignore) return;
          currentDocs = data.documents || [];
          setDocuments(currentDocs);
        } catch (err) {
          if (ignore) return;
          setDocumentError(err.message || "Could not load documents.");
          setDocumentLoading(false);
          return;
        } finally {
          if (!ignore) {
            setDocumentLoading(false);
          }
        }
      }

      if (ignore) return;

      if (!currentDocs || currentDocs.length === 0) {
        setSelectedDocument(null);
        selectedDocumentRef.current = null;
        setReady(false);
        return;
      }

      // If we are on chat route or urlDocId was explicitly provided, ensure a document is selected
      if (isChatRoute || urlDocId) {
        const matched = urlDocId
          ? currentDocs.find((d) => d.id === urlDocId)
          : null;
        const fallback =
          selectedDocumentRef.current &&
          currentDocs.some((d) => d.id === selectedDocumentRef.current.id)
            ? selectedDocumentRef.current
            : currentDocs[0];
        const targetDoc = matched || fallback;

        if (targetDoc) {
          if (
            targetDoc.id !== selectedDocumentRef.current?.id ||
            !selectedDocumentRef.current ||
            (urlConvId && activeConversationRef.current?.id !== urlConvId)
          ) {
            selectDocument(targetDoc, urlConvId);
          }
        }
      }
    }

    sync();

    return () => {
      ignore = true;
    };
  }, [isChatRoute, searchParams, selectDocument]);

  // 9. Start a fresh conversation (explicit New Chat action only)
  const startNewConversation = useCallback(async () => {
    const currentDoc = selectedDocumentRef.current;
    if (!currentDoc || !ready) return;

    // If the active conversation is already brand new (0 messages), stay on it
    if (activeConversationRef.current && messages.length === 0) {
      return;
    }

    await createConversation(currentDoc.id);
  }, [createConversation, messages.length, ready]);

  // 10. Send message in active conversation with strict document-level validation
  const sendMessage = useCallback(
    async (question) => {
      const trimmed = typeof question === "string" ? question.trim() : "";
      if (!trimmed || sending) return;

      const currentDoc = selectedDocumentRef.current;
      if (!currentDoc || !ready) return;

      // Bug 1 fix: verify active conversation belongs to selected document
      let convToUse = activeConversationRef.current;

      if (!convToUse || convToUse.documentId !== currentDoc.id) {
        const cachedList =
          conversationsCacheRef.current[currentDoc.id] || [];
        const validInCache = cachedList.find(
          (c) => c.documentId === currentDoc.id,
        );

        if (validInCache) {
          convToUse = validInCache;
        } else {
          // Create or retrieve conversation for the selected document first
          const data = await chatService.createConversation(currentDoc.id);
          convToUse = data.conversation;
          conversationsCacheRef.current[currentDoc.id] = [
            convToUse,
            ...cachedList,
          ];
          setConversations(conversationsCacheRef.current[currentDoc.id]);
        }

        activeConversationRef.current = convToUse;
        setActiveConversation(convToUse);
        lastActiveConvRef.current[currentDoc.id] = convToUse.id;
      }

      // Optimistic user message: immediately show question in the chat!
      const tempUserMsgId = `temp-user-${Date.now()}`;
      const optimisticUserMsg = {
        id: tempUserMsgId,
        conversationId: convToUse.id,
        role: "USER",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setMessages((curr) => [...curr, optimisticUserMsg]);
      setSending(true);
      setConversationError("");

      try {
        // Send with documentId for server-side cross-validation
        const data = await chatService.sendMessage(
          convToUse.id,
          trimmed,
          currentDoc.id,
        );

        if (data.userMessage && data.assistantMessage) {
          setMessages((curr) => {
            const withoutTemp = curr.filter((m) => m.id !== tempUserMsgId);
            const next = [...withoutTemp, data.userMessage, data.assistantMessage];
            messagesCacheRef.current[convToUse.id] = next;
            return next;
          });
        }

        // Update conversation in list if title changed
        const updatedTitle =
          convToUse.title === "New Chat"
            ? trimmed.slice(0, 80)
            : convToUse.title;
        const updatedConv = {
          ...convToUse,
          title: updatedTitle,
          updatedAt: new Date().toISOString(),
        };

        setConversations((current) => {
          const next = current.map((item) =>
            item.id === convToUse.id ? updatedConv : item,
          );
          conversationsCacheRef.current[currentDoc.id] = next;
          return next;
        });

        activeConversationRef.current = updatedConv;
        setActiveConversation(updatedConv);
      } catch (error) {
        // Remove optimistic user message on failure so it does not remain as a ghost message
        setMessages((curr) => curr.filter((m) => m.id !== tempUserMsgId));
        setConversationError(error.message || "Could not send message.");
        throw error;
      } finally {
        setSending(false);
      }
    },
    [ready, sending],
  );

  // 11. Delete a conversation
  const removeConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      const currentDoc = selectedDocumentRef.current;
      if (!currentDoc) return;

      try {
        await chatService.deleteConversation(conversationId, currentDoc.id);

        // Remove from message cache
        delete messagesCacheRef.current[conversationId];

        const remaining = (
          conversationsCacheRef.current[currentDoc.id] || []
        ).filter((item) => item.id !== conversationId);

        conversationsCacheRef.current[currentDoc.id] = remaining;
        setConversations(remaining);

        if (activeConversationRef.current?.id === conversationId) {
          if (remaining.length > 0) {
            await openConversation(remaining[0], currentDoc.id);
          } else if (ready) {
            await startNewConversation();
          } else {
            activeConversationRef.current = null;
            setActiveConversation(null);
            setMessages([]);
          }
        }
      } catch (error) {
        setConversationError(error.message || "Could not delete conversation.");
      }
    },
    [openConversation, ready, startNewConversation],
  );

  return {
    documents,
    selectedDocument,
    selectDocument,
    documentLoading,
    documentError,
    processing,
    processingError,
    ready,
    conversations,
    conversationsLoading,
    activeConversation,
    openConversation,
    createConversation,
    startNewConversation,
    messages,
    messagesLoading,
    conversationError,
    sending,
    sendMessage,
    removeConversation,
    retryPreparation,
    reloadDocuments: loadDocuments,
  };
}
