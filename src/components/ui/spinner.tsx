import { SpinnerIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { tw } from "@/utils/tw";

export const Spinner = ({
  className,
  ...props
}: React.ComponentProps<typeof SpinnerIcon>): ReactElement => (
  <SpinnerIcon
    aria-label="Loading"
    className={tw("animate-spin", className)}
    role="status"
    {...props}
  />
);
