export function useNotify() {
  const toast = useToast(); // @nuxt/ui

  return {
    success(message: string) {
      toast.add({
        title: "Muvaffaqiyatli",
        description: message,
        color: "success",
      });
    },
    error(message: string) {
      toast.add({ title: "Xatolik", description: message, color: "error" });
    },
    info(message: string) {
      toast.add({ title: "Ma'lumot", description: message, color: "info" });
    },
  };
}
