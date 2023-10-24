import { Card, CardBody } from "@chakra-ui/react";
import colors from "../../style/colors";

// Wrapper for any JavaScript value
const JsValueWrap: React.FC<{ value: any; space?: number }> = ({ value, space = 2 }) => {
  return (
    <Card bg={colors.gray[700]} borderRadius="5px">
      <CardBody>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "12px",
            lineHeight: "18px",
          }}
        >
          {JSON.stringify(value, null, space)}
        </pre>
      </CardBody>
    </Card>
  );
};

export default JsValueWrap;