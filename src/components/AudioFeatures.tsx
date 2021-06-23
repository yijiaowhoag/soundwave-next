interface IProps {
  audioFeatures: object[];
}

const AudioFeatures: React.FunctionComponent<IProps> = ({ audioFeatures }) => {
  console.log('audioFeatures', audioFeatures);

  return <div></div>;
};

export default AudioFeatures;
