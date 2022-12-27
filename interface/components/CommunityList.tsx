// --- React components/methods
import React, { useEffect, useState } from "react";

// --- Components
import { Icon } from "@chakra-ui/icons";
import { IoIosPeople } from "react-icons/io"
import CommunityCard from "./CommunityCard";
import ModalTemplate from "./ModalTemplate";
import NoValues from "./NoValues";

// --- Utils
import {
  createCommunity,
  getCommunities,
  updateCommunity,
  deleteCommunity,
  Community,
} from "../utils/account-requests";
import { Input } from "@chakra-ui/react";

const CommunityList = (): JSX.Element => {
  const [createCommunityModalOpen, setCreateCommunityModalOpen] = useState(false);
  const [updateCommunityModalOpen, setUpdateCommunityModalOpen] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [updatedCommunityDescription, setUpdatedCommunityDescription] = useState("");
  const [updatedCommunityName, setUpdatedCommunityName] = useState("");
  const [updatedCommunityId, setUpdatedCommunityId] = useState<Community["id"]>();
  const [error, setError] = useState<undefined | string>();
  const [communities, setCommunities] = useState<Community[]>([]);

  const handleCreateCommunity = async () => {
    try {
      await createCommunity({
        name: communityName,
        description: communityDescription,
      });
      setCommunityName("");
      setCommunityDescription("");
      setCommunities(await getCommunities());
      setCreateCommunityModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleUpdateCommunity = async (communityId: Community["id"]) => {
    try {
      await updateCommunity(communityId,
      {
        name: updatedCommunityName,
        description: updatedCommunityDescription,
      });
      setUpdatedCommunityName("");
      setUpdatedCommunityDescription("");
      setCommunities(await getCommunities());
      setUpdateCommunityModalOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeleteCommunity = async (communityId: Community["id"]) => {
    try {
      await deleteCommunity(communityId);
      setCommunities(await getCommunities());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let keysFetched = false;
    const fetchCommunities = async () => {
      if (keysFetched === false) {
        try {
          await getCommunities();
          keysFetched = true;
          setCommunities(await getCommunities());
        } catch (error) {
          console.log({ error });
          setError("There was an error fetching your Communities.");
        }
      }
    };
    fetchCommunities();
  }, []);

  const communityList = communities.map((community: Community, i: number) => {
    return (
      <CommunityCard
        key={i}
        community={community}
        communityId={community.id}
        setUpdateCommunityModalOpen={setUpdateCommunityModalOpen}
        handleDeleteCommunity={handleDeleteCommunity}
        setUpdatedCommunityId={setUpdatedCommunityId}
        setUpdatedCommunityName={setUpdatedCommunityName}
        setUpdatedCommunityDescription={setUpdatedCommunityDescription}
      />
    );
  });

  return (
    <>
      <p className="font-librefranklin text-purple-softpurple">API developers use Communities to manage scoring, settings, and log traffic for their Passport-enabled applications.</p>
      {communities.length === 0 ? (
        <NoValues
          title="Create a Community"
          description="DAOs, grants programs, applications, and projects are all considered to be communities."
          addRequest={() => {
            setCommunityName("");
            setCommunityDescription("");
            setCreateCommunityModalOpen(true);
          }}
          icon={
            <Icon
              as={IoIosPeople}
              viewBox="0 0 25 25"
              boxSize="1.9em"
              color="#6F3FF5"
            />
          }
          buttonText=" Community"
        />
      ) : (
        <div className="mt-4">
          {communityList}
          <button
            data-testid="open-community-modal"
            onClick={() => {
              setCommunityName("");
              setCommunityDescription("");
              setUpdatedCommunityName("");
              setUpdatedCommunityDescription("");
              setCreateCommunityModalOpen(true)
            }}
            className="text-md mt-5 rounded-sm border border-gray-lightgray py-1 px-6 font-librefranklin text-blue-darkblue "
            disabled={communities.length >= 5}
          >
            <span className="text-lg">+</span> Create a Community
          </button>
          {error && <div>{error}</div>}
        </div>
      )}
      <ModalTemplate
        title="Create a Community"
        isOpen={createCommunityModalOpen}
        onClose={() => setCreateCommunityModalOpen(false)}
      >
        <div className="flex flex-col">
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Name
          </label>
          <Input
            data-testid="community-name-input"
            className="mb-4"
            value={communityName}
            onChange={(name) => setCommunityName(name.target.value)}
            placeholder="Community name"
          />
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Description
          </label>
          <Input
            data-testid="community-description-input"
            value={communityDescription}
            onChange={(description) => setCommunityDescription(description.target.value)}
            placeholder="Community Description"
          />
          <div className="flex w-full justify-end">
            <button
              disabled={!communityName && !communityDescription}
              data-testid="create-button"
              className="mt-6 mb-2 rounded-sm bg-purple-gitcoinviolet py-2 px-4 text-white disabled:opacity-25"
              onClick={() => handleCreateCommunity()}
            >
              Create
            </button>
            {error && <div>{error}</div>}
          </div>
        </div>
      </ModalTemplate>
      <ModalTemplate
        title="Update Community"
        isOpen={updateCommunityModalOpen}
        onClose={() => setUpdateCommunityModalOpen(false)}
      >
        <div className="flex flex-col">
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Name
          </label>
          <Input
            data-testid="update-community-name-input"
            className="mb-4"
            value={updatedCommunityName}
            onChange={(name) => setUpdatedCommunityName(name.target.value)}
            placeholder="Community name"
          />
          <label className="text-gray-softgray font-librefranklin text-xs">
            Community Description
          </label>
          <Input
            data-testid="update-community-description-input"
            value={updatedCommunityDescription}
            onChange={(description) => setUpdatedCommunityDescription(description.target.value)}
            placeholder="Community Description"
          />
          <div className="flex w-full justify-end">
            <button
              disabled={!updatedCommunityName && !updatedCommunityDescription}
              data-testid="save-button"
              className="mt-6 mb-2 rounded-sm bg-purple-gitcoinviolet py-2 px-4 text-white disabled:opacity-25"
              onClick={() => handleUpdateCommunity(updatedCommunityId)}
            >
              Save
            </button>
            {error && <div>{error}</div>}
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};

export default CommunityList;
