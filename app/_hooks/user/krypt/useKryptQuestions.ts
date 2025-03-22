import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IResponseKryptQuestion } from "./krypt.interface";

export const useKryptQuestions = ({ id }: { id: string }) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/krypt/${id}/questions`,
    fetchUser
  );

  const questionLoading = !data && !error;
  const questionData: IResponseKryptQuestion | undefined = data;

  return {
    questionData,
    error,
    questionLoading,
    isValidating,
    mutateQuestionsKrypts: mutate,
  };
};
