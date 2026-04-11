import { HarpToast } from "@/components/harp-ui/harp-toast"
import { toast } from "sonner"

/**
 * harpToast Utility
 * 
 * Provides a type-safe API to trigger "Harp-branded" toasts using sonner.custom.
 * Each method maps to a variant in the HarpToast component.
 */
export const harpToast = {
  success: (title: string, description?: string) =>
    toast.custom((id) => (
      <HarpToast id={id} title={title} description={description} variant="success" />
    )),

  error: (title: string, description?: string) =>
    toast.custom((id) => (
      <HarpToast id={id} title={title} description={description} variant="error" />
    )),

  warning: (title: string, description?: string) =>
    toast.custom((id) => (
      <HarpToast id={id} title={title} description={description} variant="warning" />
    )),

  info: (title: string, description?: string) =>
    toast.custom((id) => (
      <HarpToast id={id} title={title} description={description} variant="info" />
    )),

  /**
   * Standard sonner fallback/standard call for simple messages
   */
  message: (title: string, description?: string) =>
    toast.custom((id) => (
      <HarpToast id={id} title={title} description={description} variant="info" />
    )),
}
