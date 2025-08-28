import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface QuestionOption {
  text: string;
  value: number;
}

interface Question {
  id: string;
  text: string;
  type: "slider" | "radio" | "text";
  min?: number;
  max?: number;
  labels?: string[];
  options?: QuestionOption[];
  scoringGuidance?: string;
}

interface QuestionCardProps {
  question: Question;
  value?: number | string;
  onChange: (value: number | string) => void;
  index: number;
}

export default function QuestionCard({ question, value, onChange, index }: QuestionCardProps) {
  const [sliderValue, setSliderValue] = useState([typeof value === 'number' ? value : 5]);
  const [textValue, setTextValue] = useState(typeof value === 'string' ? value : '');

  useEffect(() => {
    if (question.type === 'slider' && typeof value === 'number') {
      setSliderValue([value]);
    } else if (question.type === 'text' && typeof value === 'string') {
      setTextValue(value);
    }
  }, [value, question.type]);

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue);
    onChange(newValue[0]);
  };

  const handleRadioChange = (selectedValue: string) => {
    onChange(parseInt(selectedValue));
  };

  const handleTextChange = (newValue: string) => {
    setTextValue(newValue);
    onChange(newValue);
  };

  return (
    <Card className="border border-gray-200 animate-fade-in bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <label className="block text-base font-medium text-gray-900 mb-4 leading-relaxed">
          {question.text}
        </label>

        {question.type === "slider" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-3">
              <span className="bg-blue-50 px-2 py-1 rounded text-xs">{question.labels?.[0] || "Low (0)"}</span>
              <span className="bg-blue-50 px-2 py-1 rounded text-xs">{question.labels?.[1] || "High (10)"}</span>
            </div>
            
            <div className="px-2 py-2">
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={question.max || 10}
                min={question.min || 0}
                step={1}
                className="w-full my-2"
                data-testid={`slider-${question.id}`}
              />
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                <span 
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                  data-testid={`slider-value-${question.id}`}
                >
                  {sliderValue[0]} / 10
                </span>
              </div>
            </div>
          </div>
        )}

        {question.type === "radio" && question.options && (
          <RadioGroup 
            value={value?.toString()} 
            onValueChange={handleRadioChange}
            className="space-y-2"
            data-testid={`radio-group-${question.id}`}
          >
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <RadioGroupItem 
                  value={option.value.toString()} 
                  id={`${question.id}-${optionIndex}`}
                  className="text-blue-600 w-4 h-4"
                  data-testid={`radio-${question.id}-${optionIndex}`}
                />
                <Label 
                  htmlFor={`${question.id}-${optionIndex}`}
                  className="cursor-pointer flex-1 text-sm font-medium"
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {option.value}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "text" && (
          <div className="space-y-2">
            <Textarea
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Please provide your response..."
              className="min-h-[100px] resize-y text-sm"
              data-testid={`textarea-${question.id}`}
            />
            {question.scoringGuidance && (
              <p className="text-xs text-gray-500 italic">
                {question.scoringGuidance}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
