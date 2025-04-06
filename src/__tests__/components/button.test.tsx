import { render, screen } from "../utils/test-utils";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a button with text", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders a disabled button", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
  });

  it("applies variant and size classes correctly", () => {
    render(
      <Button variant="outline" size="sm">
        Click me
      </Button>
    );
    const button = screen.getByRole("button", { name: /click me/i });

    // class-variance-authorityが適用したクラスを検証
    expect(button.className).toContain("border");
    expect(button.className).toContain("bg-background");
    expect(button.className).toContain("h-8");
    expect(button.className).toContain("rounded-md");
  });
});
