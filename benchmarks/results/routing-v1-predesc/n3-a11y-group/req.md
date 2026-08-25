아래 커스텀 드롭다운이 키보드로 조작이 안 된다. `dropdown.tsx`를 수정해서 접근성을 고쳐줘.

```tsx
export default function Dropdown({ options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dropdown">
      <div className="trigger" onClick={() => setOpen(!open)}>{value}</div>
      {open && (
        <div className="menu">
          {options.map((o) => (
            <div key={o} className="item" onClick={() => { onChange(o); setOpen(false); }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```
