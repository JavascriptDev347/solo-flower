export function useNotify() {
  const toast = useToast(); // @nuxt/ui
  const { t } = useNuxtApp().$i18n;

  return {
    success(message: string) {
      toast.add({
        title: t("notify.success"),
        description: message,
        color: "success",
      });
    },
    error(message: string) {
      toast.add({ title: t("notify.error"), description: message, color: "error" });
    },
    info(message: string) {
      toast.add({ title: t("notify.info"), description: message, color: "info" });
    },
  };
}
