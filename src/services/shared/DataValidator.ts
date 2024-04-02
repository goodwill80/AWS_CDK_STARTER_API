import { SpaceDto } from "../model/Model";

export class MissingFieldError extends Error {
  constructor(missingFieldString: string) {
    super(`Value for ${missingFieldString} expected!`);
  }
}

export class JsonError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// This function will check if a requestBody or responseBody will have the required fields based on predefined interface in Model
// If no, then it will throw an error
export function validateAsSpaceEntry(arg: any) {
  if ((arg as SpaceDto).location === undefined) {
    throw new MissingFieldError("location");
  }
  if ((arg as SpaceDto).name === undefined) {
    throw new MissingFieldError("name");
  }
  if ((arg as SpaceDto).id === undefined) {
    throw new MissingFieldError("id");
  }
}
