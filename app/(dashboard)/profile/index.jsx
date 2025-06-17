import { View } from "react-native";
import { Text } from "~/components/ui/text";
import SafeView from "~/components/SafeView";
import React from "react";
import ProfileIndex from "~/components/Profile";

export default function Profile() {
  return (
    <SafeView>
      <ProfileIndex />
    </SafeView>
  );
}