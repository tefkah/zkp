import { uniorgToSlate } from './uniorgToSlate'

export default function plugin() {
  // @ts-ignore
  this.Compiler = function (node: any) {
    return uniorgToSlate(node)
  }
}
