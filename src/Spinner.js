import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export default function Spinner({ size, content }) {
  return (
    <Dimmer active inverted>
      <Loader
        size={size ? size : "massive"}
        content={content ? content : "Setting up your workspace"}
      />
    </Dimmer>
  );
}
