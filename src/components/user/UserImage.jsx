import React from "react";
import cn from "../../lib/cn";
import { imageUrl } from "../../utils/optimizationFunction";

function UserImage({ user, className }) {
  return (
    <div className="flex items-center gap-2">
      {user?.avatar && <img
        src={imageUrl(user?.avatar)}
        alt={user?.name}
        className={cn("w-10 border border-gray-300 object-contain h-10 rounded-full", className)}
      />}
      <div className="flex flex-col">
        <h1>{user?.name}</h1>
        {user?.email && <span className="text-sm text-gray-500">{user?.email}</span>}
      </div>
    </div>
  );
}

export default UserImage;
