import {
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const listboxId = `${id}-listbox`;

  const selectedIndex = options.indexOf(value);

  useEffect(() => {
    if (open && highlightedIndex >= 0) {
      optionRefs.current[highlightedIndex]?.focus();
    }
  }, [open, highlightedIndex]);

  function openMenu(preferredIndex = selectedIndex) {
    const nextIndex =
      options.length === 0
        ? -1
        : preferredIndex >= 0
          ? preferredIndex
          : 0;

    setHighlightedIndex(nextIndex);
    setOpen(true);
  }

  function closeMenu(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }

  function selectOption(index: number) {
    const option = options[index];
    if (option === undefined) return;

    closeMenu(true);
    onChange(option);
  }

  function moveHighlight(direction: 1 | -1) {
    if (options.length === 0) return;

    setHighlightedIndex((currentIndex) => {
      if (currentIndex < 0) {
        return direction === 1 ? 0 : options.length - 1;
      }

      return (currentIndex + direction + options.length) % options.length;
    });
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        openMenu(selectedIndex >= 0 ? selectedIndex : 0);
        break;
      case "ArrowUp":
        event.preventDefault();
        openMenu(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          closeMenu();
        }
        break;
    }
  }

  function handleListboxKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Home":
        event.preventDefault();
        if (options.length > 0) setHighlightedIndex(0);
        break;
      case "End":
        event.preventDefault();
        if (options.length > 0) setHighlightedIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(highlightedIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
    }
  }

  function handleBlur(event: ReactFocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      closeMenu();
    }
  }

  return (
    <div className="dropdown" onBlur={handleBlur}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        {value}
      </button>

      {open && (
        <div
          id={listboxId}
          className="menu"
          role="listbox"
          aria-labelledby={triggerId}
          onKeyDown={handleListboxKeyDown}
        >
          {options.map((option, index) => (
            <div
              key={option}
              id={`${listboxId}-option-${index}`}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              className="item"
              role="option"
              aria-selected={option === value}
              tabIndex={index === highlightedIndex ? 0 : -1}
              onFocus={() => setHighlightedIndex(index)}
              onClick={() => selectOption(index)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
