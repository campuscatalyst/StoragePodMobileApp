import { TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { Text } from "~/components/ui/text";
import { getFeedbackOptions, getFeedbackOptionsTitleSubtitle } from "~/lib/utils";
import { useAppSettingsStore } from "~/lib/store";
import { cn } from "~/lib/utils";

//this component will provide the additional things that the user felt about the app, positive/neutral/negitive.
export default function Specifics() {
  const rating = useAppSettingsStore((state) => state.rating);
  const feedbackOptionsState = useAppSettingsStore((state) => state.feedbackOptions);
  const setFeedbackOptions = useAppSettingsStore((state) => state.setFeedbackOptions);

  const feedbackOptions = useMemo(() => {
    return getFeedbackOptions(rating);
  }, [rating]);

  const isSelected = (id) => {
    return feedbackOptionsState.some((fid) => fid.id === id);
  };

  //it received the entire payload which is the {id: number, feeback: string}
  const toggleFeedbackOption = (data) => {
    let generatedSelectedList = [];
    if (isSelected(data.id)) {
      //it is already present, remove from the selected list.
      generatedSelectedList = feedbackOptionsState.filter((foption) => foption.id !== data.id);
    } else {
      generatedSelectedList = [...feedbackOptionsState, data];
    }

    setFeedbackOptions(generatedSelectedList);
  };

  const resetHandler = () => {
    /*
    <View className="flex flex-row justify-between items-center">
        {feedbackOptionsState.length !== 0 && (
          <Button className="flex-1" variant={"outline"} onPress={resetHandler}>
            <Text>Reset</Text>
          </Button>
        )}
      </View>
    */
    setFeedbackOptions([]);
  };

  return (
    <View className="gap-y-4">
      <View>
        <Text className="font-bold text-xl">{getFeedbackOptionsTitleSubtitle(rating).title}</Text>
        <Text className="text-muted-foreground">{getFeedbackOptionsTitleSubtitle(rating).subtitle}</Text>
      </View>
      <View className="pt-2 gap-y-4 rounded-md">
        <View className="gap-x-2 gap-y-4 flex flex-row items-center flex-wrap">
          {feedbackOptions?.map((f) => {
            const isOptionSelected = isSelected(f.id);

            const elementClassName = cn(
              "p-3 rounded-full border-2 shadow-sm",
              isOptionSelected ? "bg-primary border-primary" : "bg-card border-muted-foreground"
            );
            const textClassName = cn("text-base", isOptionSelected ? "text-primary-foreground" : "text-card-foreground");

            return (
              <TouchableOpacity key={`feedbackoption-${f.id}`} className={elementClassName} onPress={() => toggleFeedbackOption(f)}>
                <Text className={textClassName}>{f.feedback}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
