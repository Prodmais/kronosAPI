interface ITemplateVariable {
  [key: string]: string | number;
}

export default interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}
