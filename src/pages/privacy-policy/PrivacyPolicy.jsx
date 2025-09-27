import React, { useEffect, useState } from 'react';
import { PageLayout, PageContent } from '../../components/PageLayout';
import JoditComponent from '../../components/common/JoditComponent';
import { Button } from 'antd';
import { useGetPrivacyPolicyQuery, useAddPrivacyPolicyMutation } from '../../RTK/services/dashboard/informationApis/privacyPolicyApis';
import toast from 'react-hot-toast';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const { data, isLoading } = useGetPrivacyPolicyQuery();
  useEffect(() => {
    setContent(data?.data?.description || "");
  }, [data]);
  const [addPrivacyPolicy, { isLoading: addLoading }] = useAddPrivacyPolicyMutation();

  const handleSubmit = async () => {
    try {
      if (!content) {
        throw new Error("Please enter privacy policy");
      }
      const data = {
        description: content,
      }
      await addPrivacyPolicy(data).unwrap().then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Privacy Policy updated successfully");
        } else {
          throw new Error(res?.message || "Failed to update Privacy Policy");
        }
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update Privacy Policy");
    }
  };
  return (
    <PageLayout title="Privacy Policy">
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

export default PrivacyPolicy;
