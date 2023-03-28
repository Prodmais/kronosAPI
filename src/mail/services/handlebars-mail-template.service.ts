import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import fs from 'fs';
import IParseMailTemplate from 'src/interfaces/IParseMailTemplate';


@Injectable()
export class HandlebarsMailTemplateService {

  constructor() {}

  public async parse({file, variables}: IParseMailTemplate): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf8'
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}