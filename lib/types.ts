export enum Form {
  Initial,
  Loading,
  Success,
  Error,
}

export type Snippet = {
  title: string;
  thumbnail: string;
};

export type FormState = {
  state: Form;
  message?: string;
};
