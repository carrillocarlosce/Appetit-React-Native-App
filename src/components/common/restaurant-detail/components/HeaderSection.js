// @flow

import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import styled from 'styled-components';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import ReviewStars from 'components/common/ReviewStars';

const Container = styled(View)`
  width: 100%;
  height: ${({ theme }) => theme.metrics.getHeightFromDP('20%')}px;
`;

const ContainerShimmer = styled(ShimmerPlaceHolder)`
  width: 100%;
  height: ${({ theme }) => theme.metrics.getHeightFromDP('20%')}px;
  position: absolute;
`;

const DarkLayer = styled(View)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.darkLayer};
  position: absolute;
`;

const RestaurantImage = styled(Image).attrs({
  source: ({ imageURL }) => ({ uri: (imageURL || 'https://images.unsplash.com/photo-1521917441209-e886f0404a7b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c9da9e12bc69d92a619d44059a8d335f&auto=format&fit=crop&w=1000&q=80')}),
})`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const ContentWrapper = styled(View)`
  width: 100%;
  height: 100%;
  padding-left: ${({ theme }) => theme.metrics.largeSize}px;
  padding-bottom: ${({ theme }) => theme.metrics.smallSize}px;
  justify-content: flex-end;
`;

const RestaurantName = styled(Text)`
  color: ${({ theme }) => theme.colors.defaultWhite};
  margin-bottom: ${({ theme }) => theme.metrics.extraSmallSize}px;
  font-size: ${({ theme }) => theme.metrics.getWidthFromDP('5.4%')}px;
  fontFamily: CircularStd-Bold;
`;

type Props = {
  restaurantImage: string,
  restaurantName: string,
  reviews: number,
  stars: number,
};

type State = {
  isHeaderImageLoaded: boolean,
};

class HeaderSection extends Component<Props, State> {
  state = {
    isHeaderImageLoaded: false,
  }

  onLoadHeaderImage = () => {
    this.setState({
      isHeaderImageLoaded: true,
    });
  }

  render() {
    const {
      restaurantImage,
      restaurantName,
      reviews,
      stars,
    } = this.props;

    const { isHeaderImageLoaded } = this.state;

    return (
      <Container>
        <RestaurantImage
          onLoad={() => this.onLoadHeaderImage()}
          imageURL={restaurantImage || "Cabña del Primo"}
        />
        <DarkLayer />
        <ContentWrapper>
          <RestaurantName>
            {restaurantName}
          </RestaurantName>
          <ReviewStars
            shouldShowReviewsText
            textColor="defaultWhite"
            reviews={reviews}
            stars={stars || 3.5}
          />
        </ContentWrapper>
        <ContainerShimmer
          visible={isHeaderImageLoaded}
          autoRun
        />
      </Container>
    );
  }
}

export default HeaderSection;
