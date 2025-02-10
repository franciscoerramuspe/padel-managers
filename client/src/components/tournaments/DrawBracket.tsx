'use client';

import ReactFlow, { 
  Background, 
  Controls,
  Node,
  Edge,
  Position,
  MarkerType,
  Viewport
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Match {
  id: string;
  round: number;
  position: number;
  team1?: any;
  team2?: any;
  winner?: any;
  nextMatchId?: string;
}

interface DrawBracketProps {
  matches: Match[];
  fullScreen?: boolean;
}

export function DrawBracket({ matches, fullScreen = false }: DrawBracketProps) {
  // Función para crear un nodo de partido
  const createMatchNode = (match: Match, x: number, y: number): Node => ({
    id: match.id,
    position: { x, y },
    type: 'default',
    data: {
      label: (
        <div className="border border-gray-200 bg-white rounded-lg shadow-sm min-w-[280px]">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <span className="text-sm font-medium text-gray-600">
              {match.round === 1 ? 'Cuartos de Final' :
               match.round === 2 ? 'Semifinal' :
               match.round === 3 ? 'Final' : `Ronda ${match.round}`}
            </span>
          </div>
          <div className="p-3">
            <div className="space-y-3">
              <div className={`p-3 rounded-lg transition-colors ${
                match.winner?.id === match.team1?.id 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className="font-medium text-gray-900">
                  {match.team1?.player1?.first_name 
                    ? `${match.team1.player1.first_name} / ${match.team1.player2.first_name}`
                    : 'Por definir'}
                </p>
                {match.team1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {`${match.team1.player1.last_name} - ${match.team1.player2.last_name}`}
                  </p>
                )}
              </div>
              
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-400">vs</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className={`p-3 rounded-lg transition-colors ${
                match.winner?.id === match.team2?.id 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className="font-medium text-gray-900">
                  {match.team2?.player1?.first_name 
                    ? `${match.team2.player1.first_name} / ${match.team2.player2.first_name}`
                    : 'Por definir'}
                </p>
                {match.team2 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {`${match.team2.player1.last_name} - ${match.team2.player2.last_name}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  // Crear nodos y conexiones
  const createFlowElements = () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const roundSpacing = 400; // Aumentado para dar más espacio entre rondas
    const matchSpacing = 300; // Aumentado para dar más espacio vertical entre partidos

    // Agrupar partidos por ronda
    const matchesByRound = matches.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);

    // Calcular el offset vertical para centrar los partidos
    Object.entries(matchesByRound).forEach(([round, roundMatches]) => {
      const roundNumber = parseInt(round);
      const totalHeight = (roundMatches.length - 1) * matchSpacing;
      const startY = -totalHeight / 2; // Centrar verticalmente

      roundMatches.forEach((match, index) => {
        const y = startY + (index * matchSpacing);
        const x = (roundNumber - 1) * roundSpacing;
        
        nodes.push(createMatchNode(match, x, y));

        if (match.nextMatchId) {
          edges.push({
            id: `${match.id}-${match.nextMatchId}`,
            source: match.id,
            target: match.nextMatchId,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
            style: {
              strokeWidth: 2,
              stroke: '#94a3b8', // slate-400
            },
          });
        }
      });
    });

    return { nodes, edges };
  };

  const { nodes, edges } = createFlowElements();

  // Ajustar el viewport por defecto para un zoom más alejado
  const defaultViewport: Viewport = { x: 0, y: 0, zoom: 0.75 };

  return (
    <div className={`h-full w-full ${fullScreen ? '' : 'rounded-xl shadow-sm'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={defaultViewport}
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background color="#e2e8f0" gap={16} size={1} />
        <Controls 
          showInteractive={false}
          className="bg-white shadow-md"
        />
      </ReactFlow>
    </div>
  );
} 