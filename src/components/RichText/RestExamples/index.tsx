'use client'
import { Drawer, DrawerToggler } from '@/components/Drawer'
import { CodeIcon } from '@/icons/CodeIcon'
import React from 'react'

import type { Data, Example } from './types'

import CustomTable from '../CustomTable'
import { RichText } from '../index'
import { GenerateRequest } from './generateRequest'
import { GenerateResponse } from './generateResponse'
import type { Column } from '../CustomTable'
import classes from './index.module.scss'

const ExampleCell: React.FC<{ example: Example; row: Data }> = ({ example, row }) => {
  const { drawerContent, req, res } = example
  const drawerRow = [{ ...row, example: false, operation: false }] as any
  const slug = row?.example?.slug

  return (
    <React.Fragment>
      <DrawerToggler className={classes.toggle} slug={slug}>
        <CodeIcon className={classes.icon} size="medium" />
      </DrawerToggler>
      <Drawer size="small" slug={slug} title={row.operation}>
        <CustomTable
          bleedToEdge={false}
          className={classes.drawerTable}
          columns={columns.slice(1)}
          data={drawerRow}
        />
        <GenerateRequest req={req} row={row} />
        <GenerateResponse res={res} />
        {drawerContent && (
          <div className={classes.drawerContent}>
            <RichText content={drawerContent} />
          </div>
        )}
      </Drawer>
    </React.Fragment>
  )
}

const columns: Column[] = [
  {
    accessor: 'operation',
    components: {
      Heading: 'Operation',
      renderCell: (_, data: string) => <span>{data}</span>,
    },
  },
  {
    accessor: 'method',
    components: {
      Heading: 'Method',
      renderCell: (_, data: string) => <code>{data}</code>,
    },
  },
  {
    accessor: 'path',
    components: {
      Heading: 'Path',
      renderCell: (_, data: string) => <span className={classes.cellPath}>{data}</span>,
    },
  },
  {
    accessor: 'example',
    components: {
      Heading: 'View',
      renderCell: (row: Data, data: Example) => {
        if (!data || !row) {
          return null
        }
        return <ExampleCell example={data} row={row} />
      },
    },
  },
]

export const RestExamples: React.FC<{ data: Data[] }> = ({ data }) => {
  return <CustomTable className={classes.table} columns={columns} data={data} />
}
