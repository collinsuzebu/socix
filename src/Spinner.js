import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export default function Spinner() {
  return (
    <Dimmer active inverted>
      <Loader size="massive" content={"Setting up your workspace"} />
    </Dimmer>
  );
}
