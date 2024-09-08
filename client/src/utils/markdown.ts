import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export const loadMarkdown = (text: string) => {
  const processedText = text;

  const html = md.render(processedText);

  const updatedHtml = html
    .replace(/<img([^>]+)>/g, (match: any, attributes: any) => {
      return `<img style="display: block; margin: 0 auto;" ${attributes}>`;
    })
    .replace(/<a\s+(.*?)>/g, (match: any, attributes: any) => {
      return `<a ${attributes} target="_blank" rel="noopener noreferrer">`;
    });

  return updatedHtml;
};
