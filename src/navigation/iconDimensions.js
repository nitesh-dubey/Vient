import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const getWidth = scale => {
    return Math.min(scale * windowWidth, windowWidth);
}

const getHeight = scale => {
    return Math.min(scale * windowHeight, windowHeight);
}

export {getWidth, getHeight};