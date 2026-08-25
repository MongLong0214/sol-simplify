import {
  type FocusEvent,
  type KeyboardEvent,
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

export default function Dropdown({ options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const listboxId = `${id}-listbox`;
  const selectedIndex = options.indexOf(value);

  const openMenu = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (options.length === 0) return;

    setActiveIndex(index);
    setOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const selectOption = (index: number) => {
    const option = options[index];
    if (option === undefined) return;

    onChange(option);
    closeMenu(true);
  };

  useEffect(() => {
    if (!open) return;

    if (options.length === 0) {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (activeIndex >= options.length) {
      setActiveIndex(options.length - 1);
      return;
    }

    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open, options.length]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        openMenu();
        break;
      case "ArrowUp":
        event.preventDefault();
        openMenu(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        break;
      case "Home":
        event.preventDefault();
        openMenu(0);
        break;
      case "End":
        event.preventDefault();
        openMenu(options.length - 1);
        break;
    }
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + options.length) % options.length,
        );
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
  };

  return (
    <div className="dropdown" onBlur={handleBlur}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="trigger"
        disabled={options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
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
              key={`${option}-${index}`}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              className="item"
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={index === activeIndex ? 0 : -1}
              onFocus={() => setActiveIndex(index)}
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
