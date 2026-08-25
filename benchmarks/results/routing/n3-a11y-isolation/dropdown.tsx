import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

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
  const menuId = useId();
  const triggerId = `${menuId}-trigger`;

  const selectedIndex = options.indexOf(value);

  const openMenu = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (options.length === 0) return;
    setActiveIndex(index);
    setOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectOption = (index: number) => {
    onChange(options[index]);
    closeMenu(true);
  };

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

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
      default:
        break;
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + options.length) % options.length);
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
      default:
        break;
    }
  };

  return (
    <div
      className="dropdown"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <button
        id={triggerId}
        ref={triggerRef}
        type="button"
        className="trigger"
        disabled={options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        {value}
      </button>

      {open && (
        <div
          id={menuId}
          className="menu"
          role="listbox"
          aria-labelledby={triggerId}
          onKeyDown={handleMenuKeyDown}
        >
          {options.map((option, index) => (
            <div
              key={option}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              className="item"
              role="option"
              aria-selected={option === value}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => selectOption(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
