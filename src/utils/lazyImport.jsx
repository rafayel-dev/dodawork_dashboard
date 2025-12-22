import React from "react";

const lazyImport = (factory) => {
  return React.lazy(factory);
};

export default lazyImport;
