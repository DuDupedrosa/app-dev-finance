import { customTheme } from "@/theme/theme";
import ExpensesComponent from "@/ui/expenses";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Expenses() {
  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <ExpensesComponent />
    </SafeAreaView>
  );
}
