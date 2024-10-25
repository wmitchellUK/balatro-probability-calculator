import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp, Heart, Club, Diamond, Spade, Plus, X } from 'lucide-react';

const BalatroProbability = () => {
  const [selectedCard, setSelectedCard] = useState({ rank: 'A', suit: 'hearts' });
  const [showDeck, setShowDeck] = useState(false);
  const [hand, setHand] = useState([]);
  
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  
  const initialDeckState = {};
  ranks.forEach(rank => {
    suits.forEach(suit => {
      initialDeckState[`${rank}-${suit}`] = 1;
    });
  });

  const [deckCount, setDeckCount] = useState(initialDeckState);

  const SuitIcon = ({ suit, className = "w-3 h-3" }) => {
    const props = {
      className: `${className} ${
        suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black'
      }`
    };
    
    switch(suit) {
      case 'hearts': return <Heart {...props} />;
      case 'diamonds': return <Diamond {...props} />;
      case 'clubs': return <Club {...props} />;
      case 'spades': return <Spade {...props} />;
      default: return null;
    }
  };

  const calculateProbability = () => {
    const targetCard = `${selectedCard.rank}-${selectedCard.suit}`;
    const targetCards = deckCount[targetCard] || 0;
    const totalCards = Object.values(deckCount).reduce((a, b) => a + b, 0);
    return totalCards === 0 ? 0 : (targetCards / totalCards) * 100;
  };

  const addToHand = (rank, suit) => {
    const cardKey = `${rank}-${suit}`;
    if (deckCount[cardKey] > 0) {
      setHand(prev => [...prev, { rank, suit }]);
      setDeckCount(prev => ({
        ...prev,
        [cardKey]: prev[cardKey] - 1
      }));
    }
  };

  const removeFromHand = (index) => {
    const card = hand[index];
    const cardKey = `${card.rank}-${card.suit}`;
    setHand(prev => prev.filter((_, i) => i !== index));
    setDeckCount(prev => ({
      ...prev,
      [cardKey]: prev[cardKey] + 1
    }));
  };

  const resetDeck = () => {
    setDeckCount(initialDeckState);
    setHand([]);
  };

  const CardDisplay = ({ rank, suit, onClick, showRemove = false }) => (
    <div className="relative inline-block">
      <div className="flex">
        <div 
          className={`w-10 h-14 border-2 rounded-lg flex flex-col items-center justify-center gap-0.5
            cursor-pointer hover:border-blue-500 relative group`}
          onClick={onClick}
        >
          <div className="text-sm font-bold">{rank}</div>
          {suit && <SuitIcon suit={suit} />}
          {showRemove && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 rounded-lg">
              <X className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>
        {!showRemove && (
          <div className="flex flex-col justify-around h-14 ml-0.5">
            {suits.map(suit => {
              const cardKey = `${rank}-${suit}`;
              const count = deckCount[cardKey];
              return (
                <button
                  key={suit}
                  disabled={count === 0}
                  onClick={() => addToHand(rank, suit)}
                  className={`w-4 h-3 flex items-center justify-center ${
                    count === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                >
                  <SuitIcon suit={suit} className="w-2.5 h-2.5" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Balatro Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Hand */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Current Hand ({hand.length} cards)</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setHand([])}
              >
                Clear Hand
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50">
              {hand.map((card, index) => (
                <CardDisplay 
                  key={index}
                  rank={card.rank}
                  suit={card.suit}
                  onClick={() => removeFromHand(index)}
                  showRemove={true}
                />
              ))}
            </div>
          </div>

          {/* Card Selection */}
          <div className="space-y-2">
            <Label>Add Card to Hand</Label>
            <div className="grid grid-cols-5 sm:grid-cols-13 gap-1 p-4 border rounded-lg">
              {ranks.map(rank => (
                <CardDisplay 
                  key={rank}
                  rank={rank}
                />
              ))}
            </div>
          </div>

          {/* Probability Calculator */}
          <div className="space-y-2">
            <Label>Calculate Probability</Label>
            <div className="flex gap-2">
              <Select 
                value={selectedCard.rank} 
                onValueChange={(rank) => setSelectedCard(prev => ({ ...prev, rank }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {ranks.map(rank => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedCard.suit} 
                onValueChange={(suit) => setSelectedCard(prev => ({ ...prev, suit }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select suit" />
                </SelectTrigger>
                <SelectContent>
                  {suits.map(suit => (
                    <SelectItem key={suit} value={suit}>
                      <div className="flex items-center gap-2">
                        <SuitIcon suit={suit} className="w-4 h-4" />
                        <span className="capitalize">{suit}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center text-2xl font-bold text-blue-600">
              {calculateProbability().toFixed(2)}%
            </div>
          </div>

          {/* Deck View */}
          <div className="border rounded-lg overflow-hidden">
            <Button 
              variant="ghost" 
              className="w-full flex justify-between items-center"
              onClick={() => setShowDeck(!showDeck)}
            >
              <span>Remaining Deck</span>
              {showDeck ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showDeck && (
              <div className="p-4 grid grid-cols-5 sm:grid-cols-13 gap-1">
                {ranks.map(rank => (
                  <div key={rank} className="flex">
                    <div 
                      className="w-10 h-14 border-2 rounded-lg flex flex-col items-center justify-center gap-0.5"
                    >
                      <div className="text-sm font-bold">{rank}</div>
                    </div>
                    <div className="flex flex-col justify-around h-14 ml-1">
                      {suits.map(suit => {
                        const cardKey = `${rank}-${suit}`;
                        const count = deckCount[cardKey];
                        return (
                          <div
                            key={suit}
                            className={`h-3 flex items-center ${
                              count === 0 ? 'opacity-30' : ''
                            }`}
                          >
                            <div className="w-4 flex justify-center">
                              <SuitIcon suit={suit} className="w-3 h-3" />
                            </div>
                            {count > 0 && (
                              <span className="text-[6px] ml-0.5 tabular-nums">{count}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={resetDeck} variant="outline" className="w-full">
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalatroProbability;
