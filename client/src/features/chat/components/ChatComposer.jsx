import { ArrowUp, CornerDownLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatComposer({
  value: controlledValue,
  onChange: onControlledChange,
  textareaRef: externalTextareaRef,
  disabled,
  sending,
  onSend,
}) {
  const [internalValue, setInternalValue] = useState("");
  const fallbackRef = useRef(null);
  const textareaRef = externalTextareaRef || fallbackRef;

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Focus textarea when document becomes ready and not sending
  useEffect(() => {
    if (!disabled && !sending) {
      textareaRef.current?.focus();
    }
  }, [disabled, sending, textareaRef]);

  // Auto-resize textarea when value changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    }
  }, [value, textareaRef]);

  const handleInput = (event) => {
    const nextVal = event.target.value;
    if (isControlled) {
      onControlledChange?.(nextVal);
    } else {
      setInternalValue(nextVal);
    }
  };

  const submit = async (event) => {
    event?.preventDefault();
    const question = value.trim();
    if (!question || disabled || sending) return;

    try {
      await onSend(question);
      if (isControlled) {
        onControlledChange?.("");
      } else {
        setInternalValue("");
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } catch {
      // Keep question in composer if sending fails so user does not lose input
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat-composer-wrapper">
      <form className="chat-composer-form" onSubmit={submit}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "Select a ready document to start asking questions…"
              : "Ask a question about your document…"
          }
          disabled={disabled || sending}
          rows={1}
          aria-label="Ask a question about your document"
        />

        <div className="composer-toolbar">
          <span className="composer-hint">
            <CornerDownLeft size={12} />
            Press Enter to send, Shift + Enter for new line
          </span>

          <button
            type="submit"
            className="composer-send-btn"
            aria-label="Send message"
            disabled={disabled || sending || !value.trim()}
          >
            {sending ? (
              <span className="composer-spinner" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
