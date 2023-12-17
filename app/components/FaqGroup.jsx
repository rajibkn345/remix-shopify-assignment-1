import React from "react";

const FaqGroup = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="collapse collapse-plus">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            {item.question}
          </div>
          <div className="collapse-content">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqGroup;
