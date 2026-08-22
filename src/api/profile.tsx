import { supaClient } from '../supaClient';
import { handlePayload, Payload, SupabaseInteractor, useInteractionHandler } from './helpers';
import { Profile } from '../typesAndValidators';

type NewProfile = Omit<Profile, 'id'>;

const createNewProfile: SupabaseInteractor<NewProfile, Profile> = async (newProfile) => {
    const payload = (await supaClient.from('Profile').insert([newProfile]).select('*')) as Payload<Profile>;
    return handlePayload<Profile>(payload);
};

const updateProfile: SupabaseInteractor<Profile, Profile> = async (profile) => {
    const { id, ...fields } = profile;
    const payload = (await supaClient
        .from('Profile')
        .update(fields)
        .eq('id', id)
        .select('*')) as Payload<Profile>;
    const result = handlePayload<Profile>(payload);
    if (!result.data.length) {
        throw new Error('Profile update did not save');
    }
    return result;
};

const useCreateNewProfile = ({ queryKey }: { queryKey: string[] }) => {
    return useInteractionHandler<NewProfile, Profile>({
        interactor: createNewProfile,
        queryKey,
        getMessages: {
            // return '' or null if no message necessary
            pending: () => 'Saving new profile...',
            success: (data) => `Successfully saved new profile: ${data.first_name} ${data.last_name}`,
            mainError: (error) => error!.message,
            errors: () => `Failed to create new profile`,
        },
        handleSuccess: (data) => {
            // thing do to on success
        },
        handleFailure: (error) => {
            // thing to do on failure
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
            mainError: (error) => error!.message,
            errors: () => `Failed to save changes to profile`,
        },
        handleSuccess: (data) => {
            // thing do to on success
        },
        handleFailure: (error) => {
            // thing to do on failure
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
