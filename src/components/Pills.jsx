// taking a props
const Pills = ({ image, text, onClick }) => {
  return (
    <span className="user-pills" onClick={onClick}>
      <img src={image} alt={text} />
      <span>{text} &times;</span>
    </span>
  );
};

export default Pills;