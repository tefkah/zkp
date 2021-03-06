export const viewerNoteStyle = {
  '.headingFlex': {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  '.outlineHeadingButton': {
    display: 'none',
  },
  // h1: {
  //   //color: 'black',
  //   lineHeight: '1.2',
  //   fontSize: '20',
  //   fontWeight: 'bold',
  //   paddingTop: 2,
  // },
  // h2: {
  //   fontSize: '18',
  //   // color: 'black',
  //   fontWeight: 'bold',
  //   fontStyle: 'bold italic',
  //   paddingTop: 2,
  //   my: 1,
  // },
  // h3: {
  //   fontSize: '16',
  //   //color: 'black',
  //   paddingTop: 2,
  //   my: 1,
  // },
  // h4: {
  //   fontSize: '14',
  //   fontStyle: 'italic',
  //   //color: 'black',
  //   paddingTop: 2,
  //   my: 1,
  // },
}

export const diffStyle = {
  '.span-deletion ~ p, .span-addition ~ p': {
    display: 'inline',
  },
  title: {
    fontSize: 32,
  },
  '.block-addition': {
    // p: 3,
    color: 'green.500',
    backgroundColor: 'green.50',
    // display: 'inline-block !important',
  },
  '.block-deletion': {
    // p: 3,
    color: 'primary',
    backgroundColor: 'brand.50',
    fontStyle: 'italic',
    textDecoration: 'line-through',
    // display: 'inline-block !important',
  },
  '.span-addition': {
    // p: 3,
    color: 'green.500',
    backgroundColor: 'green.50',
    display: 'inline-block !important',
  },
  '.span-deletion': {
    // p: 3,
    color: 'primary',
    backgroundColor: 'brand.50',
    fontStyle: 'italic',
    textDecoration: 'line-through',
    display: 'inline-block !important',
  },
}

const popoverHStyles = [1, 2, 3, 4, 5, 6].reduce((acc, curr) => {
  acc[`h${curr}`] = { fontSize: `${1.2 - 0.1 * curr}rem` }
  return acc
}, {} as { [key: string]: { [keyy: string]: string } })
const popoverStyle = {
  // '.chakra-popover__body > div > h2': { fontFamily: 'Roboto', fontSize: '1.2rem' },
  '.popover': {
    p: {
      fontSize: 'xs',
    },
    // h1: { fontSize: '1.4rem' },
    // h2: { fontSize: '1.1rem' },
    // h3: { fontSize: '1.0rem' },
    // h4: { fontSize: '0.9rem' },
    // h5: { fontSize: '0.8rem' },
    // h6: { fontSize: '0.7rem' },
    ...popoverHStyles,
  },
}

export const noteStyle = {
  ...viewerNoteStyle,
  paddingTop: 2,
  '.footnote-definition': {
    justifyContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    ml: -10,
  },
  '.footnote-definition ~ h2': { display: 'none' },
  '.footnote-definition > sup': {
    top: -0.5,
    fontSize: '90%',
    display: 'inline-block !important',
    fontFamily: 'monospace',
  },
  '.footnote-definition > sup > span::before': {
    content: '"["',
  },
  '.footnote-definition > sup > span::after': {
    content: '"]"',
  },
  'div .footdef': { display: 'inline-block !important', w: '95%', pl: 2 },
  a: 'primary',
  '.math-display': { overflowX: 'scroll', maxW: '50ch' },
  '.katex-html': { overFlowY: 'hidden', overFlowX: 'scroll', height: 10 },
  ol: {
    paddingLeft: 4,
    py: 1,
  },
  'li::marker': {
    fontSize: 12,
    fontWeight: 'bold',
  },
  li: {
    pt: 1,
  },
  ul: {
    paddingLeft: '5',
  },
  div: {
    hyphens: 'auto !important',
  },
  '.title': {
    fontSize: 24,
    marginBottom: '.2em',
  },
  '.subtitle': {
    textAlign: 'center',
    fontSize: 'medium',
    fontWeight: 'bold',
    marginTop: 0,
  },
  '.TODO': { color: 'primary', fontFamily: 'monospace' },
  '.equationContainer': {
    display: 'table',
    textAlign: 'center',
    width: '100%',
  },
  '.equation': {
    verticalAlign: 'middle',
  },
  '.equation-label': {
    display: 'tableCell',
    textAlign: 'right',
    verticalAlign: 'middle',
  },
  '.inlinetask': {
    padding: '10px',
    border: '2px solid gray',
    margin: '10px',
    background: '#ffffcc',
  },
  '#org-div-home-and-up': {
    textAlign: 'right',
    fontSize: '70 % ',
    whiteSpace: 'nowrap',
  },
  textarea: { overflowX: 'auto' },
  '.linenr': { fontSize: 'smaller' },
  '.org-info-js_info-navigation': { borderStyle: 'none' },
  '#org-info-js_console-label': {
    fontSize: '10px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  '.org-info-js_search-highlight': {
    backgroundColor: '#ffff00',
    color: '#000000',
    fontWeight: 'bold',
  },
  '.org-svg': { width: '90%' },
  '.DONE': { color: 'green' },
  '.priority': { fontFamily: 'monospace', color: 'orange' },
  '.tag': {
    fontFamily: 'monospace',
    padding: '2px',
    fontSize: '80%',
    fontWeight: 'normal',
  },
  '.timestamp': { color: '#bebebe' },
  '.timestamp-kwd': { color: '#5f9ea0' },
  '.org-right': { marginLeft: 'auto', marginRight: '0px', textAlign: 'right' },
  '.org-left': { marginLeft: '0px', marginRight: 'auto', textAlign: 'left' },
  '.org-center': { marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' },
  '.underline': { textDecoration: 'underline' },
  '#postamble p': { fontSize: '90%', margin: '.2em' },
  '#preamble p': { fontSize: '90%', margin: '.2em' },
  'p.verse': { marginLeft: '3%' },
  pre: {
    // border: '1px solid #e6e6e6',
    borderRadius: '3px',
    backgroundColor: 'white',
    padding: '8pt',
    fontFamily: 'monospace',
    overflow: 'auto',
    margin: '1.2em',
  },
  'pre.src': {
    position: 'relative',
    overflow: 'auto',
  },
  'pre.src:before': {
    display: 'none',
    position: 'absolute',
    top: '-8px',
    right: '12px',
    padding: '3px',
    // color: '#555',
    backgroundColor: 'white',
  },
  'caption.t-above': { captionSide: 'top' },
  'caption.t-bottom': { captionSide: 'bottom' },
  'th.org-right': { textAlign: 'center' },
  'th.org-left': { textAlign: 'center' },
  'th.org-center': { textAlign: 'center' },
  'td.org-right': { textAlign: 'right' },
  'td.org-left': { textAlign: 'left' },
  'td.org-center': { textAlign: 'center' },
  '.footpara': { display: 'inline' },
  '.footdef': { marginBottom: '1em' },
  '.figure': { padding: '1em' },
  '.figure p': { textAlign: 'center' },

  ...diffStyle,
  ...popoverStyle,
}
