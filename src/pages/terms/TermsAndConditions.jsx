import React, { useEffect, useState } from "react";
import { PageLayout, PageContent } from "../../components/PageLayout";
import JoditComponent from "../../components/common/JoditComponent";
import { Button } from "antd";
import { useGetTermsQuery, useAddTermsMutation } from "../../RTK/services/dashboard/informationApis/termsApis";
import toast from "react-hot-toast";

const TermsAndConditions = () => {
  const { data: terms, isLoading } = useGetTermsQuery();
  const [addTerms, { isLoading: addLoading }] = useAddTermsMutation();
  const [content, setContent] = useState("");
  useEffect(() => {
    setContent(terms?.data?.description || "");
  }, [terms]);
  const handleSubmit = async () => {
    try {
      if (!content) {
        throw new Error("Please enter terms and conditions");
      }
      const data = {
        description: content,
      }
      await addTerms(data).unwrap().then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Terms and Conditions updated successfully");
        } else {
          throw new Error(res?.message || "Failed to update Terms and Conditions");
        }
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update Terms and Conditions");
    }
  };
  return (
    <PageLayout title="Terms and Conditions">
      <PageContent>
        <JoditComponent setContent={setContent} content={content} />
        <Button
          size="large"
          onClick={() => handleSubmit()}
          disabled={isLoading || addLoading}
          loading={isLoading || addLoading}
          className="max-w-48 app sidebar-button-black"
        >
          Submit
        </Button>
      </PageContent>
    </PageLayout>
  );
};

export default TermsAndConditions;
