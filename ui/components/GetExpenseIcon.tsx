import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CategoryTypeEnum } from "@/helpers/enums/categoryEnum";
import { customTheme } from "@/theme/theme";

function FoodIcon() {
  return (
    <Ionicons
      name="fast-food-sharp"
      size={20}
      color={customTheme.colors.light}
    />
  );
}

function TransportIcon() {
  return <FontAwesome name="bus" size={20} color={customTheme.colors.light} />;
}

function HouseIcon() {
  return (
    <FontAwesome5
      name="house-user"
      size={20}
      color={customTheme.colors.light}
    />
  );
}

function ServicesIcon() {
  return (
    <MaterialIcons
      name="miscellaneous-services"
      size={20}
      color={customTheme.colors.light}
    />
  );
}

function HealthIcon() {
  return (
    <MaterialIcons
      name="health-and-safety"
      size={20}
      color={customTheme.colors.light}
    />
  );
}

function EducationIcon() {
  return <AntDesign name="book" size={20} color={customTheme.colors.light} />;
}

function RecreationIcon() {
  return (
    <FontAwesome5
      name="umbrella-beach"
      size={20}
      color={customTheme.colors.light}
    />
  );
}

function ClothesIcon() {
  return (
    <Ionicons name="shirt-outline" size={20} color={customTheme.colors.light} />
  );
}

function ShoppingIcon() {
  return (
    <Feather name="shopping-cart" size={20} color={customTheme.colors.light} />
  );
}

function TaxesIcon() {
  return <FontAwesome6 name="money-bill-1" size={20} color={customTheme} />;
}

export default function GetExpenseIcon({
  expenseEnum,
}: {
  expenseEnum: number;
}) {
  function getIcon(key: number) {
    const literal = {
      [CategoryTypeEnum.FOOD]: () => <FoodIcon />,
      [CategoryTypeEnum.TRANSPORT]: () => <TransportIcon />,
      [CategoryTypeEnum.HOUSING]: () => <HouseIcon />,
      [CategoryTypeEnum.SERVICES]: () => <ServicesIcon />,
      [CategoryTypeEnum.HEALTH]: () => <HealthIcon />,
      [CategoryTypeEnum.EDUCATION]: () => <EducationIcon />,
      [CategoryTypeEnum.RECREATION]: () => <RecreationIcon />,
      [CategoryTypeEnum.CLOTHES]: () => <ClothesIcon />,
      [CategoryTypeEnum.SHOPPING]: () => <ShoppingIcon />,
      [CategoryTypeEnum.TAXES]: () => <TaxesIcon />,
    };

    return literal[key] ? literal[key]() : null;
  }

  return <>{getIcon(expenseEnum)}</>;
}
