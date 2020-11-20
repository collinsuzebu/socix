import React from "react";

export function MessageSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton__avatar"></div>
      <div className="skeleton__author"></div>
      <div className="skeleton__details"></div>
    </div>
  );
}
