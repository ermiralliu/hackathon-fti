import type { LayoutServerLoad, PageServerLoad } from "./$types";

const tabs = [
  { id: "add", label: "Add Product", route: "/panel/add" },
  { id: "view", label: "View Products", route: "/panel/view" },
  {
    id: "notifications",
    label: "Notifications",
    route: "/panel/notifications",
  },
  { id: "messages", label: "Messages", route: "/panel/messages" },
];

export const load: LayoutServerLoad = ({ url }) => {
  const paths = url.pathname.split("/");
  const temp = paths[paths.length - 1];
  const activeTab = temp;
  return {
    tabs,
    activeTab
  }
}