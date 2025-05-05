import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {useAppDispatch} from '@states/reduxHook';
import {useStyles} from 'react-native-unistyles';
import {modelStyles} from '@unistyles/modelStyles';
import {addCustomizableItem} from '@states/reducers/cartSlices';
import CustomText from '@components/global/CustomText';
import Icon from '@components/global/Icon';
import {Colors} from '@unistyles/Constants';
import DottedLine from '@components/ui/DottedLine';
import {RFValue} from 'react-native-responsive-fontsize';
import {ScalePress} from '@components/ui/ScalePress';
import AnimatedNumber from 'react-native-animated-numbers';

function transfomrSelectedOptions(
  selectedOptions: any,
  customizationOptions: any,
) {
  return Object.entries(selectedOptions).map(([type, index]) => {
    const customization = customizationOptions?.find(
      (option: any) => option?.type === type,
    );

    if (!customization || !customization?.options[index as number]) {
      throw new Error(`Invalid customization type or index for ${type}`);
    }
    return {
      type,
      selectedOption: customization?.options[index as number],
    };
  });
}

const AddItemModal: FC<{item: any; restaurant: any; onClose: () => void}> = ({
  item,
  restaurant,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const {styles} = useStyles(modelStyles);
  const [data, setData] = useState({
    quantity: 1,
    price: item?.price,
    selectedOptions: {} as Record<string, number>,
  });

  useEffect(() => {
    const defaultSelectionOptions: Record<string, number> = {};
    let initialPrice = item?.price || 0;
    item?.customizationOptions?.forEach((customization: any) => {
      if (customization?.required) {
        const defaultOptionIndex = customization?.options?.findIndex(
          (option: any) => option?.price === 0,
        );

        if (defaultOptionIndex !== -1) {
          defaultSelectionOptions[customization?.type] = defaultOptionIndex;
          initialPrice +=
            customization?.options[defaultOptionIndex]?.price || 0;
        }
      }
    });

    setData(prevData => ({
      ...prevData,
      selectedOptions: defaultSelectionOptions,
      price: initialPrice,
    }));
  }, [item]);

  const calculatePrice = (
    quantity: number,
    selectedOption: Record<string, number>,
  ) => {
    const basePrice = item?.price || 0;
    let customizationsPrice = 0;

    Object.keys(selectedOption).forEach(type => {
      const optionIndex = selectedOption[type];
      const optionPrice =
        item?.customizationOptions?.find((c: any) => c.type === type)?.options[
          optionIndex
        ]?.price || 0;
      customizationsPrice += optionPrice;
    });

    return (basePrice + customizationsPrice) * quantity;
  };

  const selectOptionHandler = (type: string, index: number) => {
    setData(prevData => {
      const updatedSelectedOption = {
        ...prevData.selectedOptions,
        [type]: index,
      };
      const updatedPrice = calculatePrice(
        prevData?.quantity,
        updatedSelectedOption,
      );

      return {
        ...prevData,
        selectedOption: updatedSelectedOption,
        price: updatedPrice,
      };
    });
  };

  const addCartHandler = () => {
    setData(prevData => ({
      ...prevData,
      quantity: prevData?.quantity + 1,
      price: calculatePrice(prevData?.quantity + 1, prevData?.selectedOptions),
    }));
  };

  const removeCartHandler = () => {
    if (data?.quantity > 1) {
      setData(prevData => ({
        ...prevData,
        quantity: prevData?.quantity - 1,
        price: calculatePrice(
          prevData?.quantity - 1,
          prevData?.selectedOptions,
        ),
      }));
    } else {
      onClose();
    }
  };

  const addItemIntoCart = async () => {
    const customizationOptions = transfomrSelectedOptions(
      data?.selectedOptions,
      item?.customizationOptions,
    ).sort((a, b) => a.type.localeCompare(b.type));

    const customizedData = {
      restaurant: restaurant,
      item: item,
      customization: {
        quantity: data?.quantity,
        price: data?.price,
        customizationOptions: customizationOptions,
      },
    };

    dispatch(addCustomizableItem(customizedData));
    onClose();
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.flexRowGap}>
          <Image source={{uri: item?.imageUrl}} style={styles.headerImage} />
          <CustomText fontFamily="Okra-Medium" fontSize={12}>
            {item?.name}
          </CustomText>
        </View>

        <View style={styles.flexRowGap}>
          <TouchableOpacity style={styles.icon}>
            <Icon
              name="bookmark-outline"
              iconFamily="Ionicons"
              color={Colors.primary}
              size={16}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Icon
              name="share-outline"
              iconFamily="Ionicons"
              color={Colors.primary}
              size={16}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {item?.customizationOptions?.map(
          (customization: any, index: number) => {
            return (
              <View style={styles.subContainer} key={index}>
                <CustomText fontFamily="Okra-Medium" fontSize={12}>
                  {customization?.typ}
                </CustomText>
                <CustomText fontFamily="Okra-Medium" variant="h7" color="#888">
                  {customization?.required
                    ? 'Required + Select any 1 option'
                    : `Add on your ${customization?.type}`}
                </CustomText>
                <DottedLine />

                {customization?.options?.map((option: any, i: number) => {
                  return (
                    <TouchableOpacity>
                      <CustomText fontFamily="Okra-Medium" fontSize={11}>
                        {option?.name}
                      </CustomText>
                      <View style={styles.flexRowGap}>
                        <CustomText fontFamily="Okra-Medium" fontSize={11}>
                          Rs {option?.price}
                        </CustomText>
                        <Icon
                          name={
                            data?.selectedOptions[customization?.type] === i
                              ? 'radiobox-marked'
                              : 'radiobox-blank'
                          }
                          iconFamily="MaterialCommunityIcons"
                          color={
                            data?.selectedOptions[customization?.type] === i
                              ? Colors.active
                              : '#888'
                          }
                          size={16}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          },
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.selectedContainer}>
          <ScalePress onPress={removeCartHandler}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="minus-thick"
              color={Colors.active}
              size={RFValue(13)}
            />
          </ScalePress>
          <AnimatedNumber
            includeComma={false}
            animationDuration={300}
            animateToNumber={data?.quantity}
            fontStyle={styles.animatedCount}
          />

          <ScalePress onPress={addCartHandler}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="plus-thick"
              color={Colors.active}
              size={RFValue(13)}
            />
          </ScalePress>
        </View>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={addItemIntoCart}>
          <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
            Add item - Rs {data?.price}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddItemModal;
