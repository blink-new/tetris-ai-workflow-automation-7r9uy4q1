export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  components: Array<{
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    connections: string[]
  }>
  connections: Array<{
    id: string
    fromComponent: string
    toComponent: string
    fromPort: 'top' | 'bottom' | 'left' | 'right'
    toPort: 'top' | 'bottom' | 'left' | 'right'
  }>
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Email Automation',
    description: 'Automated email sending workflow with timer trigger',
    category: 'Communication',
    components: [
      {
        id: 'timer-1',
        type: 'power-source',
        x: 80,
        y: 160,
        width: 80,
        height: 80,
        connections: ['processor-1']
      },
      {
        id: 'processor-1',
        type: 'microchip',
        x: 240,
        y: 160,
        width: 80,
        height: 80,
        connections: ['email-1']
      },
      {
        id: 'email-1',
        type: 'transmitter',
        x: 400,
        y: 160,
        width: 80,
        height: 80,
        connections: []
      }
    ],
    connections: [
      {
        id: 'conn-1',
        fromComponent: 'timer-1',
        toComponent: 'processor-1',
        fromPort: 'right',
        toPort: 'left'
      },
      {
        id: 'conn-2',
        fromComponent: 'processor-1',
        toComponent: 'email-1',
        fromPort: 'right',
        toPort: 'left'
      }
    ]
  },
  {
    id: 'data-pipeline',
    name: 'Data Processing Pipeline',
    description: 'Process and transform data through multiple stages',
    category: 'Data',
    components: [
      {
        id: 'input-1',
        type: 'antenna',
        x: 80,
        y: 120,
        width: 80,
        height: 80,
        connections: ['transform-1']
      },
      {
        id: 'transform-1',
        type: 'transformer',
        x: 240,
        y: 120,
        width: 80,
        height: 80,
        connections: ['memory-1']
      },
      {
        id: 'memory-1',
        type: 'memory-chip',
        x: 400,
        y: 120,
        width: 80,
        height: 80,
        connections: ['output-1']
      },
      {
        id: 'output-1',
        type: 'display',
        x: 560,
        y: 120,
        width: 80,
        height: 80,
        connections: []
      }
    ],
    connections: [
      {
        id: 'conn-1',
        fromComponent: 'input-1',
        toComponent: 'transform-1',
        fromPort: 'right',
        toPort: 'left'
      },
      {
        id: 'conn-2',
        fromComponent: 'transform-1',
        toComponent: 'memory-1',
        fromPort: 'right',
        toPort: 'left'
      },
      {
        id: 'conn-3',
        fromComponent: 'memory-1',
        toComponent: 'output-1',
        fromPort: 'right',
        toPort: 'left'
      }
    ]
  },
  {
    id: 'scheduled-tasks',
    name: 'Scheduled Task Runner',
    description: 'Run tasks on a schedule with conditional logic',
    category: 'Automation',
    components: [
      {
        id: 'scheduler-1',
        type: 'scheduler',
        x: 80,
        y: 160,
        width: 80,
        height: 80,
        connections: ['logic-1']
      },
      {
        id: 'logic-1',
        type: 'logic-gate',
        x: 240,
        y: 160,
        width: 80,
        height: 80,
        connections: ['action-1', 'action-2']
      },
      {
        id: 'action-1',
        type: 'transmitter',
        x: 400,
        y: 120,
        width: 80,
        height: 80,
        connections: []
      },
      {
        id: 'action-2',
        type: 'display',
        x: 400,
        y: 200,
        width: 80,
        height: 80,
        connections: []
      }
    ],
    connections: [
      {
        id: 'conn-1',
        fromComponent: 'scheduler-1',
        toComponent: 'logic-1',
        fromPort: 'right',
        toPort: 'left'
      },
      {
        id: 'conn-2',
        fromComponent: 'logic-1',
        toComponent: 'action-1',
        fromPort: 'top',
        toPort: 'left'
      },
      {
        id: 'conn-3',
        fromComponent: 'logic-1',
        toComponent: 'action-2',
        fromPort: 'bottom',
        toPort: 'left'
      }
    ]
  },
  {
    id: 'api-integration',
    name: 'API Integration Hub',
    description: 'Receive webhooks and process through multiple APIs',
    category: 'Integration',
    components: [
      {
        id: 'webhook-1',
        type: 'receiver',
        x: 80,
        y: 160,
        width: 80,
        height: 80,
        connections: ['processor-1']
      },
      {
        id: 'processor-1',
        type: 'microchip',
        x: 240,
        y: 160,
        width: 80,
        height: 80,
        connections: ['api-1', 'api-2']
      },
      {
        id: 'api-1',
        type: 'antenna',
        x: 400,
        y: 120,
        width: 80,
        height: 80,
        connections: []
      },
      {
        id: 'api-2',
        type: 'antenna',
        x: 400,
        y: 200,
        width: 80,
        height: 80,
        connections: []
      }
    ],
    connections: [
      {
        id: 'conn-1',
        fromComponent: 'webhook-1',
        toComponent: 'processor-1',
        fromPort: 'right',
        toPort: 'left'
      },
      {
        id: 'conn-2',
        fromComponent: 'processor-1',
        toComponent: 'api-1',
        fromPort: 'top',
        toPort: 'left'
      },
      {
        id: 'conn-3',
        fromComponent: 'processor-1',
        toComponent: 'api-2',
        fromPort: 'bottom',
        toPort: 'left'
      }
    ]
  }
]