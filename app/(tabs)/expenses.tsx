import { customTheme } from "@/theme/theme";
import BreadCrumb from "@/ui/components/BreadCrumb";
import ExpensesComponent from "@/ui/tabs/expenses";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Expenses() {
  return (
    <SafeAreaView
      style={{ backgroundColor: customTheme.colors.light, flex: 1 }}
    >
      <BreadCrumb route="Meus gastos" />
      <ExpensesComponent />
    </SafeAreaView>
  );
}
