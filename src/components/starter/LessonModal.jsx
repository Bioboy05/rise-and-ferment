import { useTranslation } from "react-i18next";
import Modal from "../common/Modal";
import Icon from "../common/Icon";

/**
 * Parse lesson content text into structured blocks.
 *
 * Recognizes:
 *  - Lines ending with ":"  → section header
 *  - Lines starting with "- " → unordered list item
 *  - Lines starting with "N. " → ordered list item
 *  - Non-empty lines       → paragraph text
 *
 * Groups consecutive list items into a single list block.
 */
function parseLessonContent(text) {
  const lines = text.split("\n");
  const blocks = [];
  let currentList = null;

  function flushList() {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    // Section header — line ending with colon
    if (line.endsWith(":") && !line.startsWith("-") && line.length > 2) {
      flushList();
      blocks.push({ type: "header", text: line.slice(0, -1) });
      continue;
    }

    // Unordered list item
    if (line.startsWith("- ")) {
      if (currentList?.listType !== "ul") {
        flushList();
        currentList = { type: "list", listType: "ul", items: [] };
      }
      currentList.items.push(line.slice(2));
      continue;
    }

    // Ordered list item (1. , 2. , etc.)
    const orderedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (orderedMatch) {
      if (currentList?.listType !== "ol") {
        flushList();
        currentList = { type: "list", listType: "ol", items: [] };
      }
      currentList.items.push(orderedMatch[2]);
      continue;
    }

    // Regular paragraph
    flushList();
    blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  return blocks;
}

/**
 * Render bold text markers: text wrapped in ** becomes <strong>.
 * Render italic: text wrapped in * becomes <em>.
 * Safe — no dangerouslySetInnerHTML.
 */
function renderInlineFormatting(text) {
  // Split on **bold** patterns first, then *italic*
  const parts = [];
  let remaining = text;
  let key = 0;

  // Process **bold** markers
  while (remaining.length > 0) {
    const boldStart = remaining.indexOf("**");
    if (boldStart === -1) {
      parts.push(remaining);
      break;
    }
    const boldEnd = remaining.indexOf("**", boldStart + 2);
    if (boldEnd === -1) {
      parts.push(remaining);
      break;
    }

    if (boldStart > 0) {
      parts.push(remaining.slice(0, boldStart));
    }
    parts.push(
      <strong key={`b${key++}`}>
        {remaining.slice(boldStart + 2, boldEnd)}
      </strong>
    );
    remaining = remaining.slice(boldEnd + 2);
  }

  return parts.length === 0 ? text : parts;
}

function LessonModal({ lesson, onClose }) {
  const { t } = useTranslation();
  const content = t(lesson.contentKey);
  const blocks = parseLessonContent(content);

  return (
    <Modal onClose={onClose} title={t(lesson.titleKey)}>
      <div className="lesson-content">
        {/* Lesson intro icon */}
        <div className="lesson-content__hero">
          <div className="lesson-content__hero-icon">
            <Icon name={lesson.icon} size={32} />
          </div>
          <p className="lesson-content__subtitle">{t(lesson.shortKey)}</p>
        </div>

        {/* Structured content */}
        <div className="lesson-content__body">
          {blocks.map((block, i) => {
            if (block.type === "header") {
              return (
                <h4 key={i} className="lesson-section-title">
                  {block.text}
                </h4>
              );
            }

            if (block.type === "list") {
              const Tag = block.listType === "ol" ? "ol" : "ul";
              return (
                <Tag key={i} className="lesson-list">
                  {block.items.map((item, j) => (
                    <li key={j} className="lesson-list__item">
                      {renderInlineFormatting(item)}
                    </li>
                  ))}
                </Tag>
              );
            }

            // paragraph
            return (
              <p key={i} className="lesson-paragraph">
                {renderInlineFormatting(block.text)}
              </p>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default LessonModal;
