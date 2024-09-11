import { supaClient } from '../supaClient';
import { handlePayload, Payload, StandardPayload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { Profile } from '../typesAndValidators';

type NewProfile = Omit<Profile, 'id'>;

const createNewProfile: SupabaseInteractor<NewProfile, Profile> = async (newProfile) => {
    const payload = (await supaClient.from('Profile').insert([newProfile]).select('*')) as Payload<Profile>;
    return handlePayload<Profile>(payload);
};

const updateProfile: SupabaseInteractor<Profile, Profile> = async (profile) => {
    console.log('updating', profile);
    const payload = (await supaClient
        .from('Profile')
        .update([profile])
        .eq('id', profile.id)
        .select('*')) as Payload<Profile>;
    return handlePayload<Profile>(payload);
};

const useCreateNewProfile = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewProfile, Profile>({
        interactor: createNewProfile,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving new profile...',
            success: (data) => `Successfully saved new profile: ${data.first_name} ${data.last_name}`,
            mainError: (error) => error.message,
            errors: (data) => `Failed to create new profile: ${data.first_name} ${data.last_name}`,
        },
        forEachError: (error) => {
            console.log(error);
            // thing to do with each error
        },
        handleSuccess: (data) => {
            console.log(data);
            // thing do to on success
        },
        handleFailure: (error) => {
            console.log(error);
            // thing to do on failure
        },
        normalizer: (payload) => {
            /* 
                should take an RPCPayload and return a StandardPayload<Profile>
                used for working with supabase rpc functions where the return type isn't standard
            */
            return payload as unknown as StandardPayload<Profile>;
        },
    });
};

const useUpdateNewProfile = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<Profile, Profile>({
        interactor: updateProfile,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving changes to profile...',
            success: (data) => `Successfully saved changes to ${data.first_name} ${data.last_name}`,
            mainError: (error) => error.message,
            errors: (data) => `Failed to save changes to ${data.first_name} ${data.last_name}`,
        },
        forEachError: (error) => {
            console.log(error);
            // thing to do with each error
        },
        handleSuccess: (data) => {
            console.log(data);
            // thing do to on success
        },
        handleFailure: (error) => {
            console.log(error);
            // thing to do on failure
        },
        normalizer: (payload) => {
            /* 
                should take an RPCPayload and return a StandardPayload<Profile>
                used for working with supabase rpc functions where the return type isn't standard
            */
            return payload as unknown as StandardPayload<Profile>;
        },
    });
};

export const useProfileCRUD = ({ queryKey }: { queryKey: string[] }) => {
    return {
        profileMutations: {
            // should have a separate type of interaction hook for each CRUD operation
            create: useCreateNewProfile({ queryKey }).mutate,
            update: useUpdateNewProfile({ queryKey }).mutate,
            // delete: useTemplateInteraction({ queryKey }).mutate,
        },
    };
};
