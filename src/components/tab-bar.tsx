import React from "react";
import AddTask from "./tasks/add-task";

export default function TabBar() {
  return (
    <div className="fixed md:hidden bottom-5 right-5 flex justify-center">
      <AddTask showIcon={true} showLabel={false} iconSize={24} variant="mobile" />
    </div>
  );
}
