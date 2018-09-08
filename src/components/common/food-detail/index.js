// @flow

import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Animated,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import styled from 'styled-components';
import appStyles from 'styles';

import CustomTab from 'components/common/CustomTab';

import IngredientsItemList from './components/IngredientsItemList';
import ReviewItemList from './components/ReviewItemList';
import FoodStatus from './components/FoodStatus';
import RestaurantInfo from './components/RestaurantInfo';

const ImageWrapper = styled(View)`
  width: 100%;
  height: ${({ theme }) => theme.metrics.getHeightFromDP('27%')};
`;

const SmokeShadow = styled(LinearGradient).attrs({
  colors: ['transparent', appStyles.colors.primaryColor, appStyles.colors.primaryColor],
})`
  width: 100%;
  height: ${({ theme }) => theme.metrics.getHeightFromDP('28%')};
  margin-top: ${({ theme }) => theme.metrics.getHeightFromDP('12%')};
`;

const FoodImage = styled(Image).attrs({
  source: ({ foodImageURL }) => ({ uri: foodImageURL }),
})`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const ContentContainer = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primaryColor};
  padding-horizontal: ${({ theme }) => theme.metrics.largeSize}px;
`;

const CardContainer = styled(View)`
  background-color: ${({ theme }) => theme.colors.defaultWhite};
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.metrics.largeSize}px;
  padding-bottom: 0px;
  border-top-left-radius: ${({ theme }) => theme.metrics.borderRadius}px;
  border-top-right-radius: ${({ theme }) => theme.metrics.borderRadius}px;
`;

const FoodDescription = styled(Text).attrs({
  numberOfLines: 3,
  ellipsizeMode: 'tail',
})`
  margin-top: ${({ theme }) => theme.metrics.mediumSize}px;
  color: ${({ theme }) => theme.colors.subText};
  font-size: ${({ theme }) => theme.metrics.getWidthFromDP('3.8%')};
  font-family: CircularStd-Book;
`;

const CustomTabWrapper = styled(View)`
  flex: 1;
`;

const FoodDescriptionShimmer = styled(ShimmerPlaceholder).attrs({
  visible: false,
  autoRun: true,
})`
  width: 100%;
  height: ${({ theme }) => theme.metrics.getHeightFromDP('15%')}px;
  padding-bottom: ${({ theme }) => theme.metrics.extraLargeSize}px;
`;

const ingredients = [
  { id: '1', name: 'Ingrediente 1' },
  { id: '2', name: 'Ingrediente 2' },
  { id: '3', name: 'Ingrediente 3' },
  { id: '4', name: 'Ingrediente 4' },
  { id: '5', name: 'Ingrediente 5' },
  { id: '6', name: 'Ingrediente 6' },
  { id: '7', name: 'Ingrediente 7' },
  { id: '8', name: 'Ingrediente 8' },
];

const revs = [
  {
    id: '1',
    reviewer: 'Vivian Souza',
    reviewerImage: 'https://s3-sa-east-1.amazonaws.com/bon-appetit-resources/reviewers/vini-souza.jpg',
    review: 'You guys really need to pay a course about How to Cook... Seriouuuslyy...',
    stars: 3,
  }, {
    id: '2',
    reviewer: 'Maria Ferrero',
    reviewerImage: 'https://s3-sa-east-1.amazonaws.com/bon-appetit-resources/reviewers/matheus-ferrero.jpg',
    review: 'Are you sure the name of this is food?',
    stars: 2.5,
  }, {
    id: '3',
    reviewer: 'Manoel Elisval',
    reviewerImage: 'https://s3-sa-east-1.amazonaws.com/bon-appetit-resources/reviewers/aleni-stoakes.jpg',
    review: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI',
    stars: 4.5,
  },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class FoodDetail extends Component {
  static navigationOptions = {
    headerTintColor: appStyles.colors.defaultWhite,
    headerTransparent: true,
    headerBackTitle: null,
  };

  _animatedFlatlistPosition = new Animated.Value(0);
  _flatListHeight = 0;

  state = {
    tabItemSelected: 0,
    isDataFetched: true,
  }

  onChangeMenuIndex = (index: number): void => {
    const onAniamateListAppear = () => {
      Animated.spring(this._animatedFlatlistPosition, {
        toValue: 0,
        bounciness: 8,
        useNativeDriver: true,
      }).start();
    };

    Animated.timing(this._animatedFlatlistPosition, {
      toValue: this._flatListHeight,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        tabItemSelected: index,
      }, () => onAniamateListAppear());
    });
  }

  onFlatlistLayout = (event: Object): void => {
    const { height } = event.nativeEvent.layout;
    this._flatListHeight = height;
  }

  renderListItem = (item, index) => {
    const { tabItemSelected } = this.state;

    const IngredientComponent = (
      <IngredientsItemList
        ingredient={item.name}
        index={index}
      />
    );

    const ReviewComponent = (
      <ReviewItemList
        isFirst={index === 0}
        reviewer={item.reviewer}
        reviewerImage={item.reviewerImage}
        review={item.review}
        stars={item.stars}
      />
    );

    const ProperComponent = (tabItemSelected === 0 ? IngredientComponent : ReviewComponent);

    return ProperComponent;
  }

  renderFoodDescription = () => {
    const { isDataFetched } = this.state;
    const { navigation } = this.props;
    const { foodDescription } = navigation.getParam('payload', {});

    const FoodDescriptionComponents = (
      <FoodDescription>
        {foodDescription || 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI'}
      </FoodDescription>
    );

    const ProperComponent = (isDataFetched ? FoodDescriptionComponents : <FoodDescriptionShimmer />);

    return ProperComponent;
  }

  renderListSection = () => {
    const tabContentWidth = appStyles.metrics.getWidthFromDP('100%') - (appStyles.metrics.largeSize * 4);
    const { tabItemSelected, isDataFetched } = this.state;
    const dataset = (tabItemSelected === 0) ? ingredients : revs;

    return isDataFetched && (
      <CustomTabWrapper>
        <CustomTab
          theme="light"
          contentWidth={tabContentWidth}
          data={[{ id: '1', title: 'Ingredients' }, { id: '2', title: 'Reviews' }]}
          onChangeMenuIndex={this.onChangeMenuIndex}
        />
        <AnimatedFlatList
          style={[{
            marginTop: this._animatedFlatlistPosition._value,
            transform: [
              {
                translateY: this._animatedFlatlistPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          }]}
          scrollEventThrottle={16}
          onLayout={this.onFlatlistLayout}
          showsVerticalScrollIndicator={false}
          data={dataset}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => this.renderListItem(item, index)}
        />
      </CustomTabWrapper>
    );
  }

  renderFoodImage = () => {
    const { navigation } = this.props;
    const { foodImageURL } = navigation.getParam('payload', {});

    return (
      <ImageWrapper>
        <FoodImage
          foodImageURL={foodImageURL}
        />
        <SmokeShadow />
      </ImageWrapper>
    );
  }

  render() {
    const { isDataFetched } = this.state;
    const { navigation } = this.props;

    const {
      foodTitle,
      price,
      reviews,
      stars,
      isOpen,
      distance,
    } = navigation.getParam('payload', {});

    return (
      <Fragment>
        {this.renderFoodImage()}
        <ContentContainer>
          <CardContainer>
            <FoodStatus
              isDataFetched={isDataFetched}
              foodTitle={foodTitle}
              price={price}
              reviews={reviews || 15}
              stars={stars}
            />
            <RestaurantInfo
              isOpen={isOpen}
              restaurantName="Cabaña del Primo"
              distance={distance || 4}
              isDataFetched={isDataFetched}
            />
            {this.renderFoodDescription()}
            {this.renderListSection()}
          </CardContainer>
        </ContentContainer>
      </Fragment>
    );
  }
}

export default FoodDetail;
