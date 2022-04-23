import { getCommitDiffForSingleFile } from './getCommitDiff'

describe('diff api', () => {
  //   const [commit1, commit2] = [
  //     'f3887c2cfd1ba32073ec44f6d1c81f7689cd2eed',
  //     'dac9e2cf1d2d9964e7ddb375b692c71326776b64',
  //   ]
  const [commit1, commit2] = [
    '4cb1dd47256b7f9947af03c82672c567173003d1',
    '635c1974031c9ba51e275c308ac38617bd8b5b46',
  ]
  // it('diffs', async () => {
  //   const x = await getModifiedCommitDiff(commit1, commit2, 'notes', 'notes/git')
  //   expect(x).toBeDefined()
  // })

  it('can diff one file', async () => {
    const diffForOneFile = await getCommitDiffForSingleFile(
      commit1,
      commit2,
      'notes',
      'notes/git',
      '.github/workflows/vercel.yml',
    )
    expect(diffForOneFile).toBeDefined()

    // [
    //   {
    //     filepath: '.github/workflows/vercel.yml',
    //     oid: '3a87f43f132a7cbf871e818c43bf47aa86079920',
    //     diff: [
    //       {
    //         count: 227,
    //         value:
    //           '# This is a basic workflow to help you get started with Actions\n' +
    //           '\n' +
    //           'name: push to vercel\n' +
    //           '\n' +
    //           '# Controls when the workflow will run\n' +
    //           'on:\n' +
    //           '  # Triggers the workflow on push or pull request events but only for the main branch\n' +
    //           '  push:\n' +
    //           '    branches: [ main ]\n' +
    //           '  pull_request:\n' +
    //           '    branches: [ main ]\n' +
    //           '\n' +
    //           '  # Allows you to run this workflow manually from the Actions tab\n' +
    //           '  workflow_dispatch:\n' +
    //           '  \n' +
    //           'defaults:\n' +
    //           '  run:\n' +
    //           "    shell: 'bash'\n" +
    //           '    \n' +
    //           '# A workflow run is made up of one or more jobs that can run sequentially or in parallel\n' +
    //           'jobs:\n' +
    //           '  # This workflow contains a single job called "build"\n' +
    //           '  ',
    //       },
    //       { count: 1, added: undefined, removed: true, value: '[' },
    //       { count: 1, value: 'vercel' },
    //       { count: 1, added: undefined, removed: true, value: ']' },
    //       {
    //         count: 130,
    //         value:
    //           ':\n' +
    //           '    # The type of runner that the job will run on\n' +
    //           '    runs-on: ubuntu-latest\n' +
    //           '\n' +
    //           '    # Steps represent a sequence of tasks that will be executed as part of the job\n' +
    //           '    steps:\n' +
    //           '      # Makes a deploy request to vercel\n' +
    //           '      - name: Deploy\n' +
    //           '        run: curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_KplxBA0Dsvk61gBuoEIDYxNRPYGZ/W0i46JGN3x"\n' +
    //           '\n' +
    //           '      \n',
    //       },
    //     ],
    //     additions: 0,
    //     deletions: 2,
    //   },
    // ])
  })
  it('can diff file good', async () => {
    const [commit3, commit4] = [
      'dac9e2cf1d2d9964e7ddb375b692c71326776b64',
      '23d36ae61a2ba87ad0ecd76dc90ad9ecfaa8a95f',
    ]
    const file = 'Gendler2020.org'
    const diffForOneFile = await getCommitDiffForSingleFile(
      commit3,
      commit4,
      'notes',
      'notes/git',
      file,
    )
    expect(diffForOneFile).toBeDefined()
  })
})
