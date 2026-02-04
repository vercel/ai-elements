import type { StructuredData } from "fumadocs-core/mdx-plugins/remark-structure";

import { createTokenizer as createTokenizerJapanese } from "@orama/tokenizers/japanese";
import { createTokenizer as createTokenizerMandarin } from "@orama/tokenizers/mandarin";
import { createI18nSearchAPI } from "fumadocs-core/search/server";

import { translations } from "@/geistdocs";
import { i18n } from "@/lib/geistdocs/i18n";
import {
  componentsSource,
  docsSource,
  examplesSource,
} from "@/lib/geistdocs/source";

const localeMap: Record<
  string,
  {
    language?: string;
    components?: {
      tokenizer:
        | ReturnType<typeof createTokenizerMandarin>
        | ReturnType<typeof createTokenizerJapanese>;
    };
    search?: {
      threshold: number;
      tolerance: number;
    };
  }
> = Object.fromEntries(
  Object.entries(translations).map(([locale, translation]) => [
    locale,
    { language: translation.displayName.toLowerCase() },
  ])
);

if ("cn" in translations) {
  localeMap.cn = {
    components: {
      tokenizer: createTokenizerMandarin(),
    },
    search: {
      threshold: 0,
      tolerance: 0,
    },
  };
}

if ("jp" in translations) {
  localeMap.jp = {
    components: {
      tokenizer: createTokenizerJapanese(),
    },
    search: {
      threshold: 0,
      tolerance: 0,
    },
  };
}

const indexes: {
  title: string;
  description: string | undefined;
  structuredData: StructuredData;
  url: string;
  id: string;
  locale: string;
}[] = [];

for (const lang of docsSource.getLanguages()) {
  for (const page of lang.pages) {
    indexes.push({
      description: page.data.description,
      id: page.url,
      locale: lang.language,
      structuredData: page.data.structuredData,
      title: page.data.title,
      url: page.url,
    });
  }
}

for (const lang of componentsSource.getLanguages()) {
  for (const page of lang.pages) {
    indexes.push({
      description: page.data.description,
      id: page.url,
      locale: lang.language,
      structuredData: page.data.structuredData,
      title: page.data.title,
      url: page.url,
    });
  }
}

for (const lang of examplesSource.getLanguages()) {
  for (const page of lang.pages) {
    indexes.push({
      description: page.data.description,
      id: page.url,
      locale: lang.language,
      structuredData: page.data.structuredData,
      title: page.data.title,
      url: page.url,
    });
  }
}

export const { GET } = createI18nSearchAPI("advanced", {
  i18n,
  indexes,
  localeMap,
});
