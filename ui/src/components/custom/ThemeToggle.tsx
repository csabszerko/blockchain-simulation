import { useTheme } from "@/components/theme-provider.js";
import { Switch } from "../ui/switch.js";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleToggle = (checked: boolean) => {
    // If checked, set light theme; if unchecked, set dark
    setTheme(checked ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <span>dark</span>
      <Switch
        id="themeToggle"
        defaultChecked={theme === "light"} // initialize based on current theme
        onCheckedChange={handleToggle}
      />
      <span>light</span>
    </div>
  );
}
