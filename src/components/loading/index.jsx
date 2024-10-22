import { Oval } from "react-loader-spinner";

export function LoadingSpinner() {
    let loadingColor = "#082A63";
    let loadingBackgroundColor = "#2C3E50";
    return <Oval
                color={loadingColor}
                secondaryColor={loadingBackgroundColor}
                wrapperStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: 1000,
                }}
              />
}